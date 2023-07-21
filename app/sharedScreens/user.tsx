import { Stack, useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import { YStack } from 'tamagui'
import Card from '../../src/components/Card'
import FullScreenLoader from '../../src/components/Core/Loader/FullScreenLoader'
import { BodyText } from '../../src/components/Core/Text'
import CenteredView, { View } from '../../src/components/Core/View'
import CommentsList from '../../src/components/InfiniteList/CommentsList'
import PostsList from '../../src/components/InfiniteList/PostsList'
import SegmentedButtonRow from '../../src/components/SegmentedButtonRow'
import SortChanger from '../../src/components/SortChanger'
import UserCard from '../../src/components/UserCard'
import { invalidateQueries, useLemmyQuery } from '../../src/lib/lemmy/rqHooks'
import queryKeys from '../../src/lib/lemmy/rqKeys'

type ValidTabId = 'posts' | 'comments' | 'bio'

export default function UserScreen() {
  const params = useLocalSearchParams<any>()
  const userId = params.user
    ? Array.isArray(params.user)
      ? params.user[0]
      : params.user
    : undefined

  const [sortType, setSortType] = useState<Lemmy.Enums.SortType>('Hot')
  const [tab, setTab] = useState<ValidTabId>(null)

  const idIsNumber = !isNaN(userId)

  const { data, isLoading, refetch, isRefetching, isError } = useLemmyQuery(
    'getUser',
    [queryKeys.USER, userId, sortType],
    {
      username: !idIsNumber ? userId : undefined,
      person_id: idIsNumber ? userId : undefined,
      sort: sortType
    }
  )

  useEffect(() => {
    if (data) {
      if (data?.person_view?.person?.bio) {
        setTab('bio')
      } else {
        setTab('posts')
      }
    }
  }, [data, isLoading])

  const bio = data?.person_view?.person?.bio

  if (isLoading) {
    return <FullScreenLoader />
  }

  const availableTabs = [
    ...(bio ? [{ label: 'Bio', id: 'bio' as ValidTabId }] : []),
    { label: 'Posts', id: 'posts' as ValidTabId },
    { label: 'Comments', id: 'comments' as ValidTabId }
  ]

  return (
    <View flex>
      <Stack.Screen
        options={{
          presentation: 'modal',
          title: data.person_view.person.name,
          headerRight: (props) => {
            return (
              <View row centerV gap="$1">
                <SortChanger
                  currentSort={sortType}
                  onChange={(sort) => setSortType(sort)}
                />
              </View>
            )
          }
        }}
      />
      <View gap="$0.5" margin="$0.5">
        <UserCard personData={data?.person_view} />
      </View>
      <YStack flex={1}>
        <SegmentedButtonRow<ValidTabId>
          options={availableTabs}
          selectedId={tab}
          onSelectedChanged={(newVal) => setTab(newVal)}
        />
        {bio && tab === 'bio' && (
          <View>
            <Card margin="$0.5">
              <BodyText>{data?.person_view?.person?.bio}</BodyText>
            </Card>
          </View>
        )}
        {tab === 'posts' && (
          <View flex>
            {data?.posts?.length > 0 ? (
              <PostsList
                data={data.posts}
                refetch={refetch}
                isLoading={isLoading}
                isRefetching={isRefetching}
                fetchNextPage={() => {}}
                footerComponent={() => (
                  <CenteredView padding="$1">
                    <BodyText>End of posts</BodyText>
                  </CenteredView>
                )}
              />
            ) : (
              <CenteredView flex>
                <BodyText>No posts to display</BodyText>
              </CenteredView>
            )}
          </View>
        )}
        {tab === 'comments' && (
          <View flex>
            {data?.comments?.length > 0 ? (
              <CommentsList
                flattenTree
                data={data.comments}
                refetch={refetch}
                onCommentActionPerformed={() => {
                  invalidateQueries([queryKeys.USER, userId])
                }}
                isLoading={isLoading}
                isRefetching={isRefetching}
                footerComponent={() => (
                  <CenteredView padding="$1">
                    <BodyText>End of comments</BodyText>
                  </CenteredView>
                )}
              />
            ) : (
              <CenteredView flex>
                <BodyText>No comments to display</BodyText>
              </CenteredView>
            )}
          </View>
        )}
      </YStack>
    </View>
  )
  // TODO: cake day
}
