import { router } from 'expo-router'
import { ReactNode, useEffect, useMemo, useState } from 'react'
import { Pressable, useWindowDimensions } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, {
  interpolate,
  interpolateColor,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated'
import useLocalServerDomain from '../../hooks/useLocalServerDomain'
import { useLemmyInfiniteQuery } from '../../lib/lemmy/rqHooks'
import queryKeys from '../../lib/lemmy/rqKeys'
import { useTemporaryStore } from '../../stores/temporaryStore'
import Avatar from '../Avatar'
import CardRow from '../CardRow'
import FullScreenLoader from '../Core/Loader/FullScreenLoader'
import { BodyText } from '../Core/Text'
import { View } from '../Core/View'
import Icon from '../Icon'
import InfiniteList from '../InfiniteList'

export default function SubscriptionDrawer({
  isOpen,
  children,
  onOpenChanged
}: {
  isOpen: boolean
  children: ReactNode
  onOpenChanged: (open: boolean) => void
}) {
  const screenDimensions = useWindowDimensions()
  const openAmountValue = useSharedValue(0)
  const gestureIsActive = useSharedValue(false)
  const screenSizeValue = useSharedValue(screenDimensions)
  const [open, setOpen] = useState(false)
  const localServer = useLocalServerDomain()

  const [setViewType] = useTemporaryStore((store) => [store.setViewType])

  const { data, isLoading, isRefetching, refetch, fetchNextPage } =
    useLemmyInfiniteQuery('getCommunities', [queryKeys.COMMUNITIES], {
      type_: 'Subscribed',
      show_nsfw: true,
      sort: 'Hot',
      limit: 50
    })

  const allCommunities = useMemo(() => {
    if (!data) {
      return []
    }
    return data?.pages?.flatMap((page) => page.communities)
  }, [data])

  useEffect(() => {
    setOpen(isOpen)
  }, [isOpen])

  useEffect(() => {
    if (open !== isOpen) {
      onOpenChanged(open)
    }
  }, [open])

  useEffect(() => {
    openAmountValue.value = withTiming(!open ? 0 : 1, { duration: 200 })
    screenSizeValue.value = screenDimensions
  }, [screenDimensions, open])

  const drawerStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    top: 0,
    left: 0,
    width: screenSizeValue.value.width * 0.8,
    height: '100%',
    zIndex: 100,
    transform: [
      {
        translateX: interpolate(
          openAmountValue.value,
          [0, 1],
          [-screenSizeValue.value.width, 0]
        )
      }
    ],
    opacity: interpolate(openAmountValue.value, [0, 0.2], [0, 1])
  }))

  const contentStyle = useAnimatedStyle(() => ({
    flex: 1,
    width: screenSizeValue.value.width,
    transform: [
      {
        translateX: interpolate(
          openAmountValue.value,
          [0, 1],
          [0, screenSizeValue.value.width * 0.5]
        )
      },
      {
        scale: interpolate(openAmountValue.value, [0, 1], [1, 0.95])
      }
    ],
    opacity: interpolate(openAmountValue.value, [0, 1], [1, 0.5])
  }))

  const backgroundStyle = useAnimatedStyle(() => ({
    flex: 1,
    backgroundColor: interpolateColor(
      openAmountValue.value,
      [0, 1],
      ['rgba(0,0,0,0)', 'rgba(0,0,0,1)']
    )
  }))

  const initialTouchLocation = useSharedValue({ x: 0, y: 0 })

  const swipeGesture = Gesture.Pan()
    .manualActivation(true)
    .onBegin((evt) => {
      initialTouchLocation.value = { x: evt.x, y: evt.y }
    })
    .onTouchesMove((ev, state) => {
      const xMove = ev.changedTouches[0].x - initialTouchLocation.value.x

      const xDiff = Math.abs(xMove)
      const yDiff = Math.abs(
        ev.changedTouches[0].y - initialTouchLocation.value.y
      )
      const isHorizontalMove = xDiff > yDiff

      if (
        isHorizontalMove &&
        ((ev.numberOfTouches === 1 && ev.allTouches[0].absoluteX < 50) ||
          open ||
          gestureIsActive.value)
      ) {
        state.activate()
        gestureIsActive.value = true
        return
      }
      gestureIsActive.value = false
      state.fail()
    })
    .onChange((ev) => {
      openAmountValue.value =
        openAmountValue.value + ev.changeX / screenSizeValue.value.width
    })
    .onEnd((ev) => {
      if (openAmountValue.value > 0.8) {
        openAmountValue.value = withTiming(1, { duration: 200 })
        runOnJS(setOpen)(true)
      } else {
        openAmountValue.value = withTiming(0, { duration: 200 })
        runOnJS(setOpen)(false)
      }
      gestureIsActive.value = false
    })

  return (
    <GestureDetector gesture={swipeGesture}>
      <View flex>
        <Animated.View style={backgroundStyle}>
          <Animated.View style={contentStyle}>{children}</Animated.View>
        </Animated.View>

        <Animated.View style={drawerStyle}>
          <View backgroundColor="$background" flex>
            <View flex>
              {isLoading ? (
                <FullScreenLoader />
              ) : (
                <InfiniteList<Lemmy.Data.CommunityData>
                  data={allCommunities}
                  refetch={refetch}
                  fetchNextPage={fetchNextPage}
                  isRefetching={isRefetching}
                  isLoading={isLoading}
                  keyExtractor={(item) => item.community.id}
                  estimatedItemSize={64}
                  contentContainerStyle={{
                    padding: 8
                  }}
                  headerComponent={() => (
                    <View gap="$0.5" marginBottom="$0.5">
                      <Pressable
                        onPress={() => {
                          setViewType('All')
                          router.push('/tabs/feed/')
                          setOpen(false)
                        }}
                      >
                        <CardRow
                          left={<Icon name="Globe2" size={24} />}
                          center={<BodyText>All communities</BodyText>}
                          right={<Icon name="ChevronRight" />}
                        />
                      </Pressable>
                      <Pressable
                        onPress={() => {
                          setViewType('Local')
                          router.push('/tabs/feed/')
                          setOpen(false)
                        }}
                      >
                        <CardRow
                          left={<Icon name="MapPin" size={24} />}
                          center={
                            <BodyText numberOfLines={1} flex>
                              All {localServer} communities
                            </BodyText>
                          }
                          right={<Icon name="ChevronRight" />}
                        />
                      </Pressable>
                      <Pressable
                        onPress={() => {
                          setViewType('Subscribed')
                          router.push('/tabs/feed/')
                          setOpen(false)
                        }}
                      >
                        <CardRow
                          left={<Icon name="MailCheck" size={24} />}
                          center={<BodyText>Subscribed communities</BodyText>}
                          right={<Icon name="ChevronRight" />}
                        />
                      </Pressable>
                      <BodyText>Your subscriptions</BodyText>
                    </View>
                  )}
                  renderItem={(item, index) => (
                    <View marginBottom="$0.5">
                      <Pressable
                        onPress={() => {
                          setViewType('All')
                          router.push(`/tabs/feed/${item.community.id}`)
                          setOpen(false)
                        }}
                      >
                        <CardRow
                          key={item.community.id}
                          left={
                            <Avatar
                              src={item.community.icon}
                              placeholderIcon="UsersIcon"
                              size={24}
                              pressable={false}
                            />
                          }
                          center={
                            <View>
                              <BodyText numberOfLines={1} flex>
                                {item.community.name}
                              </BodyText>
                              <BodyText tiny color="$fadedText">
                                {item.community.name}@
                                {new URL(item.community.actor_id).hostname}
                              </BodyText>
                            </View>
                          }
                          right={
                            <BodyText>
                              <Icon name="ChevronRight" />
                            </BodyText>
                          }
                        />
                      </Pressable>
                    </View>
                  )}
                />
              )}
            </View>
          </View>
        </Animated.View>
      </View>
    </GestureDetector>
  )
}
