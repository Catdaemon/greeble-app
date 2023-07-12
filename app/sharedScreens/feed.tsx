import { Stack, useLocalSearchParams } from 'expo-router'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Pressable } from 'react-native'
import { useSharedValue } from 'react-native-reanimated'
import CommunityHeader from '../../src/components/CommunityHeader'
import Loader from '../../src/components/Core/Loader'
import FullScreenLoader from '../../src/components/Core/Loader/FullScreenLoader'
import { BodyText } from '../../src/components/Core/Text'
import CenteredView, { View } from '../../src/components/Core/View'
import ErrorBox from '../../src/components/ErrorBox'
import Icon from '../../src/components/Icon'
import PostsList from '../../src/components/InfiniteList/PostsList'
import SortChanger from '../../src/components/SortChanger'
import SubscriptionDrawer from '../../src/components/SubscriptionDrawer'
import {
  resetInfiniteQueryCache,
  useLemmyInfiniteQuery
} from '../../src/lib/lemmy/rqHooks'
import queryKeys from '../../src/lib/lemmy/rqKeys'
import { useAccountStore } from '../../src/stores/accountStore'
import { useTemporaryStore } from '../../src/stores/temporaryStore'

function postListFooter(
  isLoading: boolean,
  isError: boolean,
  isFetchingNextPage: boolean
) {
  if (isLoading || isFetchingNextPage) {
    return <Loader />
  }

  if (isError) {
    return (
      <BodyText>
        It appears you have reached the end of the feed, congrats!
      </BodyText>
    )
  }
}

export function FeedScreen() {
  const [sortType, setSortType] = useState<Lemmy.Enums.SortType>('Hot')
  const [viewType] = useTemporaryStore((state) => [state.viewType])
  const activeAccount = useAccountStore((state) => state.activeAccount)
  const previousActiveAccount = useRef(activeAccount)
  const [firstLoad, setFirstLoad] = useState(true)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const params = useLocalSearchParams<any>()
  const community = params.community
    ? Array.isArray(params.community)
      ? params.community[0]
      : params.community
    : undefined

  const idIsNumber = !isNaN(community)

  const queryParams: Omit<Lemmy.Requests.GetPosts.Request, 'page'> = {
    sort: sortType,
    limit: 10,
    type_: viewType,
    community_id: idIsNumber ? community : undefined,
    community_name: idIsNumber ? undefined : community
  }

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    fetchNextPage,
    isFetchingNextPage,
    isRefetching,
    isInitialLoading
  } = useLemmyInfiniteQuery(
    'getPosts',
    [queryKeys.POSTS, community, sortType, viewType],
    queryParams
  )

  const doRefetch = () => {
    resetInfiniteQueryCache([queryKeys.POSTS])
    refetch()
  }

  useEffect(() => {
    if (!firstLoad && previousActiveAccount.current !== activeAccount) {
      doRefetch()
      previousActiveAccount.current = activeAccount
    }
  }, [activeAccount, firstLoad])

  useEffect(() => {
    if (!isInitialLoading) {
      setFirstLoad(false)
    }
  }, [isInitialLoading])

  const allPosts = useMemo(
    () =>
      data?.pages.flatMap((x, page) => x.posts.map((p) => ({ ...p, page }))) ??
      [],
    [isFetchingNextPage, data, community]
  )

  const scrollAmount = useSharedValue(0)

  const content = (
    <>
      {isLoading && <FullScreenLoader />}
      {!isLoading && !isError && (
        <PostsList
          data={allPosts}
          isLoading={isLoading}
          fetchNextPage={fetchNextPage}
          isRefetching={isRefetching}
          refetch={doRefetch}
          headerComponent={() =>
            community ? (
              <CommunityHeader
                communityId={community}
                scrollAmount={scrollAmount}
              ></CommunityHeader>
            ) : null
          }
          footerComponent={() => (
            <CenteredView height="$2">
              {postListFooter(isLoading, isError, isFetchingNextPage)}
            </CenteredView>
          )}
          onScroll={(ev) =>
            (scrollAmount.value = ev.nativeEvent.contentOffset.y)
          }
        />
      )}
      {!isLoading && isError && (data?.pages?.length ?? 0) < 2 && (
        <View flex center>
          <ErrorBox error="Something went wrong :(" onRetry={() => refetch()} />
        </View>
      )}
    </>
  )

  return (
    <View flex>
      <Stack.Screen
        options={{
          title: community ? 'Community' : `${viewType} - ${sortType}`,
          headerBackVisible: true,
          fullScreenGestureEnabled: true,
          headerLeft: () =>
            community ? null : (
              <Pressable
                onPress={() => setDrawerOpen(!drawerOpen)}
                style={{
                  marginRight: 8
                }}
              >
                <Icon name="Menu" />
              </Pressable>
            ),
          headerRight: (props) => {
            return (
              <View row centerV gap="$1">
                {/* <ViewTypeSelector /> */}
                <SortChanger
                  currentSort={sortType}
                  onChange={(sort) => setSortType(sort)}
                />
              </View>
            )
          }
        }}
      />
      {!community ? (
        <SubscriptionDrawer
          isOpen={drawerOpen}
          onOpenChanged={(val) => setDrawerOpen(val)}
        >
          {content}
        </SubscriptionDrawer>
      ) : (
        content
      )}
    </View>
  )
}

export default function FeedHome() {
  return <FeedScreen />
}
