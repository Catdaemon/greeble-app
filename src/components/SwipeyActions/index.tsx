import * as Haptics from 'expo-haptics'
import { ReactNode, useEffect, useState } from 'react'
import { ColorValue, View, ViewProps } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming
} from 'react-native-reanimated'
import Icon, { IconName } from '../Icon'

export interface SwipeyAction {
  icon: IconName
  color: ColorValue
  onActivate: () => void
}

export type SwipeyActionsProps = {
  leftOptions: SwipeyAction[]
  rightOptions: SwipeyAction[]
  longPressAction?: () => void
  children: ReactNode
} & ViewProps

export default function SwipeyActions({
  leftOptions,
  rightOptions,
  longPressAction,
  children,
  ...props
}: SwipeyActionsProps) {
  const numLeftOptions = leftOptions.length
  const numRightOptions = rightOptions.length
  const MIN_DISTANCE = 64
  const NEXT_ITEM_DISTANCE = 128

  const dragStartX = useSharedValue(0)
  const dragX = useSharedValue(0)
  const initialTouchLocation = useSharedValue<{ x: number; y: number } | null>(
    null
  )
  const isHorizontalPanning = useSharedValue(false)
  const opacity = useSharedValue(0)
  const [activeAction, setActiveAction] = useState<SwipeyAction>(null)
  const [willActivate, setWillActivate] = useState(false)

  const scale = useSharedValue(1)

  function onActivate() {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    setWillActivate(false)
    setActiveAction(null)
  }

  const getActiveAction = (minDistance: number) => {
    'worklet'
    const dragDistance = Math.abs(dragX.value)
    if (dragDistance > minDistance) {
      if (dragX.value > 0) {
        // Activate the left option
        const actionToActivate = Math.min(
          Math.floor(dragDistance / NEXT_ITEM_DISTANCE),
          numLeftOptions - 1
        )
        return leftOptions[actionToActivate]
      }
      if (dragX.value < 0) {
        // Activate the right option
        const actionToActivate = Math.min(
          Math.floor(dragDistance / NEXT_ITEM_DISTANCE),
          numRightOptions - 1
        )

        return rightOptions[actionToActivate]
      }
    }
    return null
  }

  const _setActiveAction = () => {
    setActiveAction(getActiveAction(0))
  }

  const openContextMenu = () => {
    if (longPressAction) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
      scale.value = withTiming(1.1, { duration: 100 }, () => {
        scale.value = withTiming(1, { duration: 100 })
      })

      longPressAction()
    }
  }

  const longPressGesture = Gesture.LongPress()
    .onBegin((evt) => {})
    .onStart(() => {
      runOnJS(openContextMenu)()
    })
    .onEnd((evt) => {})

  const panGesture = Gesture.Pan()
    .manualActivation(true)
    .onBegin((evt) => {
      initialTouchLocation.value = { x: evt.x, y: evt.y }
    })
    .onTouchesMove((evt, state) => {
      if (!initialTouchLocation.value || !evt.changedTouches.length) {
        state.fail()
        return
      }
      if (isHorizontalPanning.value) {
        state.activate()
        return
      }
      const xMove = evt.changedTouches[0].x - initialTouchLocation.value.x

      // If we're panning left and there are no left options, fail
      if (xMove > 0 && !numLeftOptions) {
        state.fail()
        return
      }
      // If we're panning right and there are no right options, fail
      if (xMove < 0 && !numRightOptions) {
        state.fail()
        return
      }

      const xDiff = Math.abs(xMove)
      const yDiff = Math.abs(
        evt.changedTouches[0].y - initialTouchLocation.value.y
      )
      isHorizontalPanning.value = xDiff >= yDiff

      if (isHorizontalPanning.value) {
        state.activate()
      } else {
        state.fail()
      }
    })
    .onStart((e) => {
      dragStartX.value = dragX.value
    })
    .onChange((e) => {
      dragX.value = dragStartX.value + e.translationX
      opacity.value = Math.min(Math.abs(dragX.value) / MIN_DISTANCE, 1)

      if (opacity.value === 1 && !willActivate) {
        runOnJS(setWillActivate)(true)
      } else if (opacity.value < 1 && willActivate) {
        runOnJS(setWillActivate)(false)
      }

      const active = getActiveAction(0)
      if (active !== activeAction) {
        runOnJS(_setActiveAction)()
      }
    })
    .onEnd(() => {
      isHorizontalPanning.value = false
      const active = getActiveAction(MIN_DISTANCE)

      if (active) {
        runOnJS(active.onActivate)()
        runOnJS(onActivate)()
      }

      dragX.value = withSpring(0)
      opacity.value = withTiming(0, { duration: 100 })
    })

  useEffect(() => {
    if (willActivate) {
      Haptics.selectionAsync().catch(() => {})
    }
  }, [activeAction, willActivate])

  const icon = activeAction?.icon
  const renderedIcon = icon ? (
    <Icon
      name={icon}
      size="$2"
      color="white"
      fillColor={willActivate ? 'white' : 'transparent'}
    />
  ) : null

  const iconContainerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: activeAction?.color,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24
  }))

  const childContainerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: dragX.value }, { scale: scale.value }]
  }))

  return (
    <View {...props}>
      <Animated.View style={iconContainerStyle}>
        {renderedIcon}
        {renderedIcon}
      </Animated.View>
      <GestureDetector gesture={Gesture.Race(longPressGesture, panGesture)}>
        <Animated.View style={childContainerStyle}>{children}</Animated.View>
      </GestureDetector>
    </View>
  )
}
