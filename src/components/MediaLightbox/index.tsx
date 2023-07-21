import * as Burnt from 'burnt'
import * as Clipboard from 'expo-clipboard'
import * as Haptics from 'expo-haptics'

import { ReactNode, useEffect, useState } from 'react'
import { Modal, Pressable, Share } from 'react-native'
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView
} from 'react-native-gesture-handler'
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming
} from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import useActionSheet from '../../hooks/useActionSheet'
import getMediaBase64 from '../../lib/getMediaBase64'
import saveMediaToPhotos from '../../lib/saveMediaToPhotos'
import Loader from '../Core/Loader'
import { BodyText } from '../Core/Text'
import { View } from '../Core/View'
import Icon from '../Icon'
import openLink from '../../lib/openLink'

const closeDistance = 50
const fadeDistance = 200

export interface MediaLightboxProps {
  thumbnail: ReactNode
  content: ReactNode
  contentUrl: string
  enableLightbox?: boolean
}

export default function MediaLightbox({
  thumbnail,
  content,
  contentUrl,
  enableLightbox = true
}: MediaLightboxProps) {
  const safeAreaInsets = useSafeAreaInsets()
  const [open, setOpen] = useState(false)
  const [render, setRender] = useState(false)
  const [showActions, setShowActions] = useState(false)

  const opacity = useSharedValue(0)
  const dragStartX = useSharedValue(0)
  const dragStartY = useSharedValue(0)
  const dragX = useSharedValue(0)
  const dragY = useSharedValue(0)

  const zoomPointX = useSharedValue(0)
  const zoomPointY = useSharedValue(0)
  const zoomAmountStart = useSharedValue(1)
  const zoomAmount = useSharedValue(1)

  const controlsOpacity = useSharedValue(1)

  const showActionSheet = useActionSheet(
    null,
    [
      {
        title: 'Copy',
        action: async () => {
          try {
            const b64 = await getMediaBase64(contentUrl)
            await Clipboard.setImageAsync(b64)
            Burnt.toast({
              haptic: 'success',
              title: 'Copied image to clipboard',
              duration: 2
            })
          } catch (e) {
            Burnt.toast({
              haptic: 'error',
              title: 'Failed to copy image to clipboard',
              duration: 2
            })
          } finally {
            setShowActions(false)
          }
        }
      },
      {
        title: 'Save',
        action: async () => {
          try {
            await saveMediaToPhotos(contentUrl)
            Burnt.toast({
              haptic: 'success',
              title: 'Saved to photos',
              duration: 2
            })
          } catch (e) {
            Burnt.toast({
              haptic: 'error',
              title: 'Failed to save',
              duration: 2
            })
          } finally {
            setShowActions(false)
          }
        }
      },
      {
        title: 'Share',
        action: () => {
          Share.share({
            url: contentUrl
          })
          setShowActions(false)
        }
      }
    ],
    true,
    () => setShowActions(false)
  )

  const panGesture = Gesture.Pan()
    .onStart((e) => {
      dragStartX.value = dragX.value
      dragStartY.value = dragY.value
      controlsOpacity.value = withTiming(1, {
        duration: 200
      })
    })
    .onChange((e) => {
      dragX.value = dragStartX.value + e.translationX
      dragY.value = dragStartY.value + e.translationY
      if (zoomAmount.value === 1) {
        opacity.value = Math.max(1 - Math.abs(dragY.value) / fadeDistance, 0)
      }
    })
    .onEnd(() => {
      if (zoomAmount.value === 1) {
        if (Math.abs(dragY.value) > closeDistance) {
          opacity.value = withTiming(
            0,
            {
              duration: 200
            },
            () => runOnJS(setOpen)(false)
          )
        } else {
          dragX.value = withSpring(0)
          dragY.value = withSpring(0)
          opacity.value = withSpring(1)
        }
      } else {
        opacity.value = 1
      }

      controlsOpacity.value = withDelay(
        2000,
        withTiming(0, {
          duration: 200
        })
      )
    })

  const zoomGesture = Gesture.Pinch()
    .onStart((e) => {
      zoomAmountStart.value = zoomAmount.value
    })
    .onChange((e) => {
      zoomAmount.value = zoomAmountStart.value * e.scale
    })
    .onEnd(() => {
      if (zoomAmount.value < 1) {
        dragX.value = withSpring(0)
        dragY.value = withSpring(0)
        zoomAmount.value = withSpring(1)
      }
    })

  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      if (zoomAmount.value === 1) {
        zoomPointX.value = dragX.value
        zoomPointY.value = dragY.value
        zoomAmount.value = withSpring(2)
      } else {
        zoomPointX.value = withSpring(0)
        zoomPointY.value = withSpring(0)
        dragX.value = withSpring(0)
        dragY.value = withSpring(0)
        zoomAmount.value = withSpring(1)
      }
    })

  const longPressGessure = Gesture.LongPress()
    .minDuration(500)
    .onStart(() => {
      runOnJS(setShowActions)(true)
    })

  const gestures = Gesture.Simultaneous(
    panGesture,
    zoomGesture,
    doubleTapGesture,
    longPressGessure
  )

  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      position: 'absolute',
      backgroundColor: 'black',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      width: '100%',
      height: '100%'
    }
  })

  const animatedImageStyle = useAnimatedStyle(() => {
    return {
      flex: 1,
      transform: [
        {
          translateX: dragX.value
        },
        {
          translateY: dragY.value
        },
        {
          scale: zoomAmount.value
        }
      ]
    }
  })

  useEffect(() => {
    if (open) {
      setRender(true)
      opacity.value = withTiming(1, { duration: 200 })
      dragX.value = withTiming(0, { duration: 1 })
      dragY.value = withTiming(0, { duration: 1 })
    } else {
      opacity.value = withTiming(0, { duration: 200 }, () => {
        runOnJS(setRender)(false)
      })
    }
  }, [open])

  useEffect(() => {
    if (showActions) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {})
      zoomAmount.value = withSpring(0.95)
      showActionSheet()
    } else {
      zoomAmount.value = withSpring(1)
    }
  }, [showActions])

  useEffect(() => {
    controlsOpacity.value = withDelay(1000, withTiming(0, { duration: 200 }))
  }, [])

  return (
    <>
      <Pressable
        onPress={() => (enableLightbox ? setOpen(true) : openLink(contentUrl))}
      >
        {thumbnail}
      </Pressable>
      {render && (
        <>
          <Modal
            animationType="none"
            transparent={true}
            visible={true}
            supportedOrientations={['portrait', 'landscape']}
          >
            <GestureHandlerRootView style={{ flex: 1 }}>
              <GestureDetector gesture={gestures}>
                <Animated.View style={animatedContainerStyle}>
                  <Pressable
                    onPress={() => setOpen(false)}
                    style={{
                      position: 'absolute',
                      top: safeAreaInsets.top,
                      left: safeAreaInsets.left,
                      width: 32,
                      height: 32,
                      zIndex: 100
                    }}
                  >
                    <Animated.View
                      style={{
                        opacity: controlsOpacity
                      }}
                    >
                      <Icon name="X" size={32} color="lightText" />
                    </Animated.View>
                  </Pressable>
                  <Animated.View style={animatedImageStyle}>
                    {content}
                  </Animated.View>
                </Animated.View>
              </GestureDetector>
            </GestureHandlerRootView>
          </Modal>
        </>
      )}
    </>
  )
}
