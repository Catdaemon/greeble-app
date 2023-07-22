import { Stack, useRouter } from 'expo-router'
import { useMemo, useState } from 'react'
import { Pressable } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import AccountSwitcher from '../../../src/components/AccountSwitcher'
import Avatar from '../../../src/components/Avatar'
import Card from '../../../src/components/Card'
import CardRow from '../../../src/components/CardRow'
import { BodyText, HeadingText } from '../../../src/components/Core/Text'
import CenteredView, { View } from '../../../src/components/Core/View'
import Icon from '../../../src/components/Icon'
import CommentsList from '../../../src/components/InfiniteList/CommentsList'
import PostsList from '../../../src/components/InfiniteList/PostsList'
import SegmentedButtonRow from '../../../src/components/SegmentedButtonRow'
import TextWithIcon from '../../../src/components/TextWithIcon'
import useActiveAccount from '../../../src/hooks/useActiveAccount'
import {
  useLemmyInfiniteQuery,
  useLemmyQuery
} from '../../../src/lib/lemmy/rqHooks'
import queryKeys from '../../../src/lib/lemmy/rqKeys'
import pluraliseNumber from '../../../src/lib/pluraliseNumber'
import FullScreenLoader from '../../../src/components/Core/Loader/FullScreenLoader'

type ValidTabId = 'posts' | 'comments' | 'savedPosts' | 'savedComments'

function SavedPosts() {
  const { data, isLoading, refetch, isRefetching } = useLemmyInfiniteQuery(
    'getPosts',
    [queryKeys.POSTS, 'saved'],
    {
      limit: 50,
      saved_only: true
    }
  )

  const allPosts = useMemo(
    () => data?.pages?.flatMap((x) => x.posts).filter((x) => !!x),
    [data?.pages?.length]
  )

  if (isLoading) {
    return <FullScreenLoader />
  }

  return (
    <View flex>
      {allPosts?.length > 0 ? (
        <PostsList
          data={allPosts}
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
  )
}

function SavedComments() {
  const { data, isLoading, refetch, isRefetching } = useLemmyInfiniteQuery(
    'getComments',
    [queryKeys.POSTS, 'saved'],
    {
      limit: 50,
      saved_only: true
    }
  )
  const allComments = useMemo(
    () => data?.pages?.flatMap((x) => x.comments).filter((x) => !!x),
    [data?.pages?.length]
  )

  if (isLoading) {
    return <FullScreenLoader />
  }

  return (
    <View flex>
      {allComments?.length > 0 ? (
        <CommentsList
          flattenTree
          onCommentActionPerformed={() => {}}
          data={allComments}
          refetch={refetch}
          isLoading={isLoading}
          isRefetching={isRefetching}
          fetchNextPage={() => {}}
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
  )
}

function MyComments() {
  const activeUser = useActiveAccount()
  const { data, isLoading, refetch, isRefetching, isError } = useLemmyQuery(
    'getUser',
    [queryKeys.USER, activeUser.username, 'New'],
    {
      username: activeUser.username,
      sort: 'New',
      limit: 50
    }
  )
  const allComments = data?.comments

  if (isLoading) {
    return <FullScreenLoader />
  }

  return (
    <View flex>
      {allComments?.length > 0 ? (
        <CommentsList
          flattenTree
          onCommentActionPerformed={() => {}}
          data={allComments}
          refetch={refetch}
          isLoading={isLoading}
          isRefetching={isRefetching}
          fetchNextPage={() => {}}
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
  )
}

function MyPosts() {
  const activeUser = useActiveAccount()
  const { data, isLoading, refetch, isRefetching, isError } = useLemmyQuery(
    'getUser',
    [queryKeys.USER, activeUser.username, 'New'],
    {
      username: activeUser.username,
      sort: 'New',
      limit: 50
    }
  )
  const allPosts = data?.posts

  if (isLoading) {
    return <FullScreenLoader />
  }

  return (
    <View flex>
      {allPosts?.length > 0 ? (
        <PostsList
          data={allPosts}
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
  )
}

export default function AccountScreen() {
  const router = useRouter()
  const activeAccount = useActiveAccount()
  const [tab, setTab] = useState<ValidTabId>('posts')

  const { data: myAccountData } = useLemmyQuery(
    'getSite',
    [queryKeys.SITE, activeAccount.accountID],
    {}
  )

  const isAnonymous = !activeAccount.token
  const localUserData = myAccountData?.my_user?.local_user_view

  const [switcherOpen, setSwitcherOpen] = useState(false)

  return (
    <View flex padding="$0.5">
      <Stack.Screen
        options={{
          title: 'Account',
          headerRight: () => (
            <TouchableOpacity onPress={() => router.push('/tabs/account/add')}>
              <Icon name="Plus" />
            </TouchableOpacity>
          ),
          headerLeft: () => (
            <AccountSwitcher
              open={switcherOpen}
              onOpenChanged={setSwitcherOpen}
              button={
                <Pressable onPress={() => setSwitcherOpen(true)}>
                  <Icon name="ArrowRightLeft" />
                </Pressable>
              }
              placement="bottom"
            />
          )
        }}
      />
      {activeAccount && (
        <View>
          <Card center padding="$1" marginBottom="$0.5" gap="$1">
            <HeadingText>Active account</HeadingText>
            {isAnonymous ? (
              <Icon name="VenetianMask" size="$4" color="$fadedText" />
            ) : (
              <Avatar
                size={96}
                src={localUserData?.person?.avatar}
                placeholderIcon="User"
              />
            )}
            <View center>
              <HeadingText>{activeAccount.username}</HeadingText>
              <BodyText>{new URL(activeAccount.serverURL).hostname}</BodyText>
            </View>
            {!isAnonymous && (
              <View gap="$0.5" width="100%">
                <View row justifyContent="space-between">
                  <TextWithIcon
                    icon="MessagesSquare"
                    text={`${
                      localUserData?.counts?.comment_count
                    } ${pluraliseNumber(
                      localUserData?.counts?.comment_count,
                      'comment',
                      'comments'
                    )}`}
                  />
                  <TextWithIcon
                    icon="Mail"
                    text={`${
                      localUserData?.counts?.post_count
                    } ${pluraliseNumber(
                      localUserData?.counts?.post_count,
                      'post',
                      'posts'
                    )}`}
                  />
                </View>
                <View row justifyContent="space-between">
                  <TextWithIcon
                    icon="Award"
                    text={`${localUserData?.counts?.comment_score} comment score`}
                  />
                  <TextWithIcon
                    icon="Award"
                    text={`${localUserData?.counts?.post_score} post score`}
                  />
                </View>
              </View>
            )}
          </Card>
          {!isAnonymous && (
            <View>
              <CardRow
                left={<Icon name="Ban" />}
                center={<BodyText>Manage block lists</BodyText>}
                right={<Icon name="ChevronRight" />}
              />
            </View>
          )}
        </View>
      )}
      <View flex>
        {!isAnonymous && (
          <View>
            <SegmentedButtonRow<ValidTabId>
              scroll
              selectedId={tab}
              onSelectedChanged={setTab}
              options={[
                {
                  id: 'posts',
                  label: 'My posts'
                },
                {
                  id: 'comments',
                  label: 'My comments'
                },
                {
                  id: 'savedPosts',
                  label: 'Saved posts'
                },
                {
                  id: 'savedComments',
                  label: 'Saved comments'
                }
              ]}
            />
          </View>
        )}
        {tab === 'savedPosts' && <SavedPosts />}
        {tab === 'savedComments' && <SavedComments />}
        {tab === 'comments' && <MyComments />}
        {tab === 'posts' && <MyPosts />}
      </View>
    </View>
  )
}
