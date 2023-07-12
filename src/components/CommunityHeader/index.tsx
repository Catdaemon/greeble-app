import { Dimensions, useWindowDimensions } from 'react-native'
import Animated, {
  SharedValue,
  interpolate,
  useAnimatedStyle,
  useDerivedValue
} from 'react-native-reanimated'
import { useLemmyMutation, useLemmyQuery } from '../../lib/lemmy/rqHooks'
import Image from '../Core/Image'
import { useTheme } from 'tamagui'
import { View } from '../Core/View'
import { BodyText, HeadingText } from '../Core/Text'
import Button from '../Core/Button'
import Avatar from '../Avatar'
import queryKeys from '../../lib/lemmy/rqKeys'
import Loader from '../Core/Loader'
import FullScreenLoader from '../Core/Loader/FullScreenLoader'
import { Stack, router } from 'expo-router'
import { HeaderBackground } from '@react-navigation/elements'
import Icon from '../Icon'
import MoreButton from '../Core/MoreButton'
import useActionSheet from '../../hooks/useActionSheet'

export interface CommunityHeaderProps {
  communityId?: string
  scrollAmount?: SharedValue<number>
}

const EXPANDED_HEIGHT = 16 * 16
const COLLAPSED_HEIGHT = 16 * 6
const AVATAR_SIZE = 16 * 4
const PADDING = 16

export default function CommunityHeader({
  communityId,
  scrollAmount
}: CommunityHeaderProps) {
  const theme = useTheme()
  const dimensions = useWindowDimensions()

  const idIsNumber = !isNaN(Number(communityId))

  const { data, isLoading, refetch, isRefetching } = useLemmyQuery(
    'getCommunity',
    [queryKeys.COMMUNITY, communityId],
    {
      id: idIsNumber ? communityId : undefined,
      name: !idIsNumber ? communityId : undefined
    },
    {
      enabled: !!communityId
    }
  )

  const { mutateAsync: setSubscribed, isLoading: subscribeLoading } =
    useLemmyMutation('subscribeToCommunity', [queryKeys.COMMUNITIES])

  const { mutateAsync: block, isLoading: blockLoading } = useLemmyMutation(
    'blockCommunity',
    [queryKeys.COMMUNITIES]
  )

  const showActionSheet = useActionSheet('Community actions', [
    {
      title: 'Block community',
      action: async () => {
        await block({
          community_id: data.community_view.community.id,
          block: true
        })
        router.back()
      }
    }
  ])

  if (!communityId) {
    return null
  }

  const domain = data?.community_view?.community?.actor_id
    ? new URL(data.community_view.community.actor_id).hostname
    : ''

  return (
    <>
      <Stack.Screen
        options={{
          title: isLoading
            ? 'Community'
            : data?.community_view?.community?.title ?? 'Community',
          headerBackground: () => {
            return data?.community_view?.community?.banner ? (
              <View flex backgroundColor="$contentBackground">
                <Image
                  enableLightbox
                  style={{
                    width: dimensions.width,
                    height: 200
                  }}
                  contentFit="cover"
                  contentPosition="center"
                  blurRadius={5}
                  src={data.community_view.community.banner}
                />
              </View>
            ) : (
              <HeaderBackground />
            )
          }
        }}
      />
      <View backgroundColor="$contentBackground" marginBottom="$0.5">
        {isLoading || blockLoading ? (
          <FullScreenLoader />
        ) : (
          <View row spread padding="$0.5" gap="$1">
            <Avatar
              placeholderIcon="Users"
              size={72}
              src={data.community_view.community.icon}
            />
            <View flex>
              <View row spread>
                <View flex>
                  <HeadingText flex numberOfLines={1}>
                    {data.community_view.community.title}
                  </HeadingText>
                  <View row gap="$1">
                    <View row centerV>
                      <Icon name="Mail" size={16} color="$fadedText" />
                      <BodyText> {data.community_view.counts.posts}</BodyText>
                    </View>
                    <View row centerV>
                      <Icon name="Users" size={16} color="$fadedText" />
                      <BodyText>
                        {' '}
                        {data.community_view.counts.subscribers}
                      </BodyText>
                    </View>
                  </View>
                </View>
                <View>
                  <Button
                    onPress={() =>
                      setSubscribed({
                        community_id: data.community_view.community.id,
                        follow:
                          data.community_view.subscribed === 'NotSubscribed'
                      }).then(() => refetch())
                    }
                    size="medium"
                    variant="primary"
                    label={
                      data.community_view.subscribed !== 'NotSubscribed'
                        ? 'Unsubscribe'
                        : 'Subscribe'
                    }
                    marginLeft="$1"
                    loading={subscribeLoading || isRefetching}
                  ></Button>
                </View>
              </View>
              <View row spread>
                <BodyText flex numberOfLines={1}>
                  {data.community_view.community.name}@{domain}
                </BodyText>
                <MoreButton onPress={showActionSheet} />
              </View>
            </View>
          </View>
        )}
      </View>
    </>
  )
}
