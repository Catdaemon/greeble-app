import { Stack, useLocalSearchParams } from 'expo-router'
import { useEffect, useMemo, useState } from 'react'
import CommentSortChanger from '../../src/components/CommentSortChanger'
import Loader from '../../src/components/Core/Loader'
import FullScreenLoader from '../../src/components/Core/Loader/FullScreenLoader'
import { BodyText } from '../../src/components/Core/Text'
import CenteredView from '../../src/components/Core/View'
import ErrorBox from '../../src/components/ErrorBox'
import CommentsList from '../../src/components/InfiniteList/CommentsList'
import Post from '../../src/components/Post'
import {
  resetInfiniteQueryCache,
  useLemmyInfiniteQuery,
  useLemmyMutation,
  useLemmyQuery
} from '../../src/lib/lemmy/rqHooks'
import getPostCommunityName from '../../src/lib/lemmy/util/getPostCommunityName'
import getPostUsername from '../../src/lib/lemmy/util/getPostUsername'
import { useAccountStore } from '../../src/stores/accountStore'
import queryKeys from '../../src/lib/lemmy/rqKeys'
import { useAppSettingsStore } from '../../src/stores/appSettingsStore'
import PostActions from '../../src/components/Post/PostActions'

function listFooter(
  isLoading: boolean,
  isError: boolean,
  isFetchingNextPage: boolean,
  noComments: boolean
) {
  if (isLoading || isFetchingNextPage) {
    return <Loader />
  }

  if (isError) {
    return <BodyText>Something went wrong :(</BodyText>
  }

  if (noComments) {
    return <BodyText>No comments here - be the first!</BodyText>
  }

  return <BodyText>End of comments</BodyText>
}

export default function CommentsScreen() {
  const params = useLocalSearchParams<any>()
  const postId = Array.isArray(params.postId) ? params.postId[0] : params.postId
  const activeAccount = useAccountStore((state) => state.activeAccount)
  const shouldMarkAsRead = useAppSettingsStore(
    (state) => state.markPostsReadOnOpen
  )
  const [isFirstMount, setIsFirstMount] = useState(true)

  const idIsNumber = !isNaN(postId)

  const { data: postData, isLoading: postLoading } = useLemmyQuery(
    'getSinglePost',
    [queryKeys.POST, postId],
    {
      id: idIsNumber ? postId : undefined
    }
  )

  const { mutateAsync: markAsRead, isLoading: isMarkingRead } =
    useLemmyMutation('markPostRead', [queryKeys.POST, postId])

  useEffect(() => {
    if (
      !postData?.post_view?.read &&
      postData?.post_view?.post?.id &&
      shouldMarkAsRead
    ) {
      markAsRead({
        post_id: postData?.post_view?.post?.id,
        read: true
      })
    }
  }, [postData, postData?.post_view?.read])

  const [sortType, setSortType] = useState<Lemmy.Enums.CommentSortType>('Hot')

  const queryArgs = {
    post_id: postId,
    sort: sortType,
    max_depth: 10,
    type_: 'All'
  } as Lemmy.Requests.GetComments.Request

  const {
    data,
    isLoading,
    isError,
    refetch,
    isFetchingNextPage,
    isRefetching
  } = useLemmyInfiniteQuery(
    'getComments',
    [queryKeys.POSTCOMMENTS, postId, sortType],
    queryArgs
  )

  const doRefetch = () => {
    resetInfiniteQueryCache([queryKeys.POSTCOMMENTS, postId, sortType])
    refetch()
  }

  useEffect(() => {
    if (!isFirstMount) {
      doRefetch()
    }
  }, [activeAccount, sortType])

  useEffect(() => {
    setIsFirstMount(false)
  }, [])

  const allComments = useMemo(
    () =>
      data?.pages.flatMap((x, page) => x.comments.map((x) => ({ ...x, page }))),
    [data, postId]
  )

  if (isFirstMount || isLoading || postLoading) {
    return <FullScreenLoader />
  }

  return (
    <CenteredView flex>
      <Stack.Screen
        options={{
          title: 'Post Comments',
          fullScreenGestureEnabled: true,

          headerRight: (props) => {
            return (
              <CommentSortChanger
                currentSort={sortType}
                onChange={(sort) => setSortType(sort)}
              />
            )
          }
        }}
      />
      {!isLoading && !isError && (
        <CommentsList
          onCommentActionPerformed={() => {
            refetch()
          }}
          data={allComments}
          isLoading={isLoading}
          isRefetching={isRefetching}
          refetch={doRefetch}
          opUserId={postData?.post_view.post.creator_id}
          headerComponent={() => {
            if (!postData) return null
            return (
              <>
                <Post
                  cardView
                  author={getPostUsername(postData.post_view)}
                  authorId={postData.post_view.post.creator_id}
                  community={getPostCommunityName(postData.post_view)}
                  communityId={postData.post_view.community.id}
                  isNsfw={postData.post_view.post.nsfw}
                  title={postData.post_view.post.name}
                  id={postData.post_view.post.id.toString()}
                  read={postData.post_view.read}
                  counts={{
                    downvotes: postData.post_view.counts.downvotes,
                    replies: postData.post_view.counts.comments,
                    upvotes: postData.post_view.counts.upvotes
                  }}
                  date={postData.post_view.post.published}
                  imageUrl={postData.post_view.post.thumbnail_url}
                  linkUrl={postData.post_view.post.url}
                  videoUrl={postData.post_view.post.embed_video_url}
                  body={postData.post_view.post.body}
                  renderBody
                />
                <PostActions post={postData.post_view} />
              </>
            )
          }}
          footerComponent={() => (
            <CenteredView padding="$2">
              {listFooter(
                isLoading,
                isError,
                isFetchingNextPage,
                allComments?.length === 0
              )}
            </CenteredView>
          )}
        />
      )}
      {!isLoading && isError && (
        <ErrorBox error="Something went wrong :(" onRetry={refetch} />
      )}
    </CenteredView>
  )
}
