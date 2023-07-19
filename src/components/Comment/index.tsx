import { formatDistanceStrict } from 'date-fns'
import { ReactNode, useEffect, useState } from 'react'
import { Pressable } from 'react-native'
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated'
import useActionSheet from '../../hooks/useActionSheet'
import { useLemmyCommentMutation } from '../../lib/lemmy/rqHooks'
import { useAppSettingsStore } from '../../stores/appSettingsStore'
import Loader from '../Core/Loader'
import { BodyText } from '../Core/Text'
import { View } from '../Core/View'
import Icon from '../Icon'
import MarkdownView from '../MarkdownView'
import SwipeyActions, { SwipeyAction } from '../SwipeyActions'
import TextWithIcon from '../TextWithIcon'

// colors to use for comment depth
const commentColorSequence = [
  'transparent',
  '#ff0000',
  '#00ff00',
  '#0000ff',
  '#ffff00',
  '#ff00ff',
  '#00ffff',
  '#ff8000',
  '#ff0080',
  '#80ff00',
  '#8000ff',
  '#0080ff',
  '#00ff80',
  '#800000'
]

function getCommentColor(depth: number) {
  return commentColorSequence[depth % commentColorSequence.length]
}

export interface CommentProps {
  id: string
  onActionPerformed: () => void
  onReplyPressed?: () => void
  path: string
  author: ReactNode
  body: string
  replyCount: number
  children?: CommentProps[]
  depth: number
  date: string
  upvotes: number
  downvotes: number
  myVote: number
  saved: boolean
  isOP?: boolean
  isMod?: boolean
  isAdmin?: boolean
  startCollapsed?: boolean
}

function getCommentActionList(
  enabled: boolean,
  upvote: boolean,
  downvote: boolean,
  bookmark: boolean,
  reply: boolean,

  onUpvote: () => void,
  onDownvote: () => void,
  onBookmark: () => void,
  onReply: () => void
): SwipeyAction[] {
  if (!enabled) {
    return []
  }

  return [
    reply && {
      icon: 'Reply',
      onActivate: onReply,
      color: '#0000ff'
    },
    upvote && {
      icon: 'ThumbsUp',
      onActivate: onUpvote,
      color: '#00ff00'
    },
    downvote && {
      icon: 'ThumbsDown',
      onActivate: onDownvote,
      color: '#ff0000'
    },
    bookmark && {
      icon: 'Bookmark',
      onActivate: onBookmark,
      color: '#98FB98'
    }
  ].filter((x) => !!x) as SwipeyAction[]
}

function getCommentLeftActions(
  mutations: ReturnType<typeof useLemmyCommentMutation>,
  onReply: () => void
): SwipeyAction[] {
  const [actionsEnabled, bookmark, downvote, upvote, reply] =
    useAppSettingsStore((store) => [
      store.leftCommentActions,
      store.leftCommentBookmark,
      store.leftCommentDownvote,
      store.leftCommentUpvote,
      store.leftCommentReply
    ])

  return getCommentActionList(
    actionsEnabled,
    upvote,
    downvote,
    bookmark,
    reply,
    mutations.likeComment,
    mutations.dislikeComment,
    mutations.saveComment,
    onReply
  )
}
function getCommentRightActions(
  mutations: ReturnType<typeof useLemmyCommentMutation>,
  onReply: () => void
): SwipeyAction[] {
  const [actionsEnabled, bookmark, downvote, upvote, reply] =
    useAppSettingsStore((store) => [
      store.rightCommentActions,
      store.rightCommentBookmark,
      store.rightCommentDownvote,
      store.rightCommentUpvote,
      store.rightCommentReply
    ])

  return getCommentActionList(
    actionsEnabled,
    upvote,
    downvote,
    bookmark,
    reply,
    mutations.likeComment,
    mutations.dislikeComment,
    mutations.saveComment,
    onReply
  )
}

export default function Comment({
  id,
  onActionPerformed,
  onReplyPressed,
  author,
  body,
  replyCount,
  children,
  depth,
  upvotes,
  downvotes,
  myVote,
  saved,
  isOP,
  isMod,
  isAdmin,
  date,
  startCollapsed
}: CommentProps) {
  const [collapsed, setCollapsed] = useState(startCollapsed)
  const [renderCollapsed, setRenderCollapsed] = useState(!startCollapsed)
  const [initialHeight, setInitialHeight] = useState(0)
  const mutations = useLemmyCommentMutation(id, onActionPerformed)
  const [actionLoading, setActionLoading] = useState(false)

  const heightAmount = useSharedValue(1)
  const opacityAmount = useSharedValue(1)

  const showActionSheet = useActionSheet('Comment actions', [
    {
      title: 'Reply',
      action: () => {
        onReplyPressed?.()
      }
    },
    {
      title: myVote === 1 ? 'Undo vote' : 'Upvote',
      action: async () => {
        setActionLoading(true)
        if (myVote === 1) {
          await mutations.removeLike()
        } else {
          await mutations.likeComment()
        }
        setActionLoading(false)
      }
    },
    {
      title: myVote === -1 ? 'Undo vote' : 'Downvote',
      action: async () => {
        setActionLoading(true)
        if (myVote === -1) {
          await mutations.removeLike()
        } else {
          await mutations.dislikeComment()
        }
        setActionLoading(false)
      }
    },
    {
      title: saved ? 'Unsave' : 'Save',
      action: async () => {
        setActionLoading(true)
        if (!saved) {
          mutations.saveComment()
        } else {
          mutations.unsaveComment()
        }
        setActionLoading(false)
      }
    },
    {
      title: 'Report',
      action: async () => {}
    }
  ])

  useEffect(() => {
    if (collapsed) {
      heightAmount.value = withTiming(0, {
        duration: 200,
        easing: Easing.inOut(Easing.ease)
      })
      opacityAmount.value = withTiming(
        0,
        {
          duration: 200,
          easing: Easing.inOut(Easing.ease)
        },
        () => runOnJS(setRenderCollapsed)(false)
      )
      setRenderCollapsed(false)
    } else {
      setRenderCollapsed(true)
      heightAmount.value = withTiming(1, {
        duration: 200,
        easing: Easing.inOut(Easing.ease)
      })
      opacityAmount.value = withTiming(1, {
        duration: 200,
        easing: Easing.inOut(Easing.ease)
      })
    }
  }, [collapsed])

  const collapserStyle = useAnimatedStyle(() => ({
    height:
      initialHeight === 0 || heightAmount.value === 1
        ? 'auto'
        : Math.max(heightAmount.value * initialHeight, 40)
  }))
  const hiderStyle = useAnimatedStyle(() => ({
    opacity: opacityAmount.value
  }))
  const showerStyle = useAnimatedStyle(() => ({
    opacity: 1 - opacityAmount.value,
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%'
  }))

  const header = (
    <View flex row spread gap="$0.5">
      <View flex row gap="$0.25">
        {author}
        {isOP && (
          <BodyText bold color="$opColor">
            [OP]
          </BodyText>
        )}
        {isMod && (
          <BodyText bold color="$moderatorColor">
            [Moderator]
          </BodyText>
        )}
        {isAdmin && (
          <BodyText bold color="$adminColor">
            [Admin]
          </BodyText>
        )}
      </View>
      <TextWithIcon
        icon="Clock"
        text={formatDistanceStrict(new Date(date), new Date(), {
          addSuffix: false
        })}
      />
    </View>
  )

  const actualComment = (
    <View
      borderLeftWidth={2}
      borderLeftColor={getCommentColor(depth)}
      gap="$0.5"
      padding="$0.5"
      backgroundColor="$contentBackground"
    >
      {header}
      <View>
        <MarkdownView content={body} />
      </View>
      <View flex row justifyContent="flex-end" gap="$0.5">
        {actionLoading ? (
          <Loader micro />
        ) : (
          <>
            <TextWithIcon
              icon="ThumbsUp"
              iconColor={myVote === 1 ? '$primaryColor' : '$fadedText'}
              text={upvotes.toString()}
            />
            <TextWithIcon
              icon="ThumbsDown"
              iconColor={myVote === -1 ? '$primaryColor' : '$fadedText'}
              text={downvotes.toString()}
            />
            {saved && <Icon name="Bookmark" size="$1" color="$primaryColor" />}
          </>
        )}
      </View>
    </View>
  )

  return (
    <View>
      <Animated.View
        onLayout={(event) => {
          if (initialHeight !== 0) return
          setInitialHeight(event.nativeEvent.layout.height)
        }}
        style={collapserStyle}
      >
        <View minHeight={40}>
          <Pressable onPress={() => setCollapsed(!collapsed)}>
            <Animated.View style={showerStyle}>
              <View
                marginTop="$0.25"
                borderLeftWidth={2}
                borderLeftColor={getCommentColor(depth)}
                backgroundColor="$contentBackground"
                padding="$0.5"
              >
                {header}
              </View>
            </Animated.View>
            <Animated.View style={hiderStyle}>
              <SwipeyActions
                leftOptions={getCommentLeftActions(mutations, onReplyPressed)}
                rightOptions={getCommentRightActions(mutations, onReplyPressed)}
                longPressAction={showActionSheet}
                style={{
                  marginTop: 4
                }}
              >
                {actualComment}
              </SwipeyActions>
            </Animated.View>
          </Pressable>
          {replyCount > 0 && (
            // <View
            //   style={{
            //     marginLeft: 16
            //   }}
            // >
            //   <FlashList
            //     estimatedItemSize={141}
            //     data={renderCollapsed ? children : []}
            //     keyExtractor={(item) => `reply-${item.key}`}
            //     renderItem={({ item }) => <Comment {...item} />}
            //   />
            // </View>
            <View marginLeft="$0.5" display={renderCollapsed ? 'flex' : 'none'}>
              {children.map((child) => (
                <Comment {...child} key={`reply-${child.path}`} />
              ))}
            </View>
          )}
        </View>
      </Animated.View>
    </View>
  )
}
