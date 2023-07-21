import { FlashList } from '@shopify/flash-list'
import { useMemo } from 'react'
import { useLemmyQuery } from '../../../lib/lemmy/rqHooks'
import getPostUsername from '../../../lib/lemmy/util/getPostUsername'
import { useAppSettingsStore } from '../../../stores/appSettingsStore'
import Comment, { CommentProps } from '../../Comment'
import { View } from '../../Core/View'
import InfiniteList, { InfiniteListImplementation } from '..'
import queryKeys from '../../../lib/lemmy/rqKeys'
import { useComposeCommentStore } from '../../../stores/compose/composeCommentStore'
import { router } from 'expo-router'
import useActiveAccountData from '../../../hooks/useActiveAccountData'
import { BodyText } from '../../Core/Text'
import Icon from '../../Icon'
import { Pressable } from 'react-native'

const renderListItem = (item, index) => {
  return <Comment {...item} />
}

function getCommentLTreePath(comment: CommentProps) {
  // Split the path string and remove the first element
  return comment.path.split('.').slice(1)
}

function getChildren(
  rootComment: CommentProps,
  allComments: CommentProps[],
  depth: number,
  startCollapsed: boolean
) {
  const commentsAtDepth = allComments.filter((x) => {
    const path = getCommentLTreePath(x)
    return path.length === depth
  })

  const children = commentsAtDepth.filter((x) => {
    const path = getCommentLTreePath(x)
    return Number(path[path.length - 2]) === Number(rootComment.id)
  })

  return children.map((x) => {
    const _children = getChildren(x, allComments, depth + 1, startCollapsed)
    return {
      ...x,
      depth,
      children: _children,
      replyCount: _children.length,
      startCollapsed
    } as CommentProps
  })
}

function buildCommentTree(comments: CommentProps[], collapseChildren: boolean) {
  // each comment contains a path property, which is a string of numbers separated by dots
  const rootComments = comments
    .filter((x) => getCommentLTreePath(x).length === 1)
    .map((x) => {
      const children = getChildren(x, comments, 2, collapseChildren)
      return {
        ...x,
        children,
        replyCount: children.length
      } as CommentProps
    })

  return rootComments as CommentProps[]
}

export interface CommentsListProps
  extends InfiniteListImplementation<Lemmy.Data.CommentData> {
  opUserId?: string
  flattenTree?: boolean
  onCommentActionPerformed: () => void
}

export default function CommentsList({
  opUserId,
  data,
  onCommentActionPerformed,
  flattenTree = false,
  ...props
}: CommentsListProps) {
  const collapseChildren = useAppSettingsStore(
    (state) => state.defaultCollapseChildren
  )

  const {
    data: communityData,
    refetch,
    isRefetching
  } = useLemmyQuery(
    'getCommunity',
    [queryKeys.COMMUNITY, data?.[0]?.community.id ?? 'unknown'],
    {
      id: data?.[0]?.community.id
    },
    {
      enabled: !!data?.[0]?.community.id
    }
  )

  const activeAccount = useActiveAccountData()
  const myAccountId = activeAccount?.accountData?.person?.id

  const commentPropsTree = useMemo(() => {
    const commentsAsProps =
      data?.map(
        (x) =>
          ({
            author: getPostUsername(x),
            onActionPerformed: onCommentActionPerformed,
            onReplyPressed: () => {
              useComposeCommentStore.setState({
                message: '',
                replyingToComment: x
              })
              router.push('/comment/compose')
            },
            onEditPressed: () => {
              useComposeCommentStore.setState({
                editingId: x.comment.id,
                message: x.comment.content,
                replyingToComment: null
              })
              router.push('/comment/compose')
            },
            body: x.comment.content,
            path: x.comment.path,
            id: x.comment.id,
            date: x.comment.published,
            upvotes: x.counts.upvotes,
            downvotes: x.counts.downvotes,
            replyCount: x.counts.comments,
            myVote: x.my_vote,
            saved: x.saved,
            isOP: x.comment.creator_id === opUserId,
            isAdmin: x.creator.admin,
            isMod: communityData?.moderators.some(
              (m) => m.moderator.id == x.comment.creator_id
            ),
            isMe: x.comment.creator_id === myAccountId,
            depth: 0,
            embeddedButton: !flattenTree ? undefined : (
              <Pressable onPress={() => router.push(`/comments/${x.post.id}`)}>
                <View
                  row
                  borderRadius={4}
                  borderColor="$fadedText"
                  borderWidth={1}
                  padding="$0.5"
                  gap="$1"
                  centerV
                >
                  <Icon name="Forward" color="$fadedText" />
                  <BodyText flex numberOfLines={1}>
                    {x.post.name}
                  </BodyText>
                </View>
              </Pressable>
            ),
            children: []
          } as CommentProps)
      ) ?? []
    const tree = flattenTree
      ? commentsAsProps
      : buildCommentTree(commentsAsProps, collapseChildren)
    return tree
  }, [data, collapseChildren, communityData, myAccountId])

  return (
    <View flex width="100%">
      <InfiniteList
        {...props}
        estimatedItemSize={64}
        data={commentPropsTree}
        refetch={refetch}
        isRefetching={isRefetching}
        keyExtractor={(item) => {
          return `comment-${item.date}${item.path}${item.id}${
            (item as any).page
          }`
        }}
        renderItem={renderListItem}
      />
    </View>
  )
}
