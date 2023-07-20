import { Pressable, Share } from 'react-native'
import { View } from '../Core/View'
import Icon, { IconName } from '../Icon'
import { useLemmyMutation } from '../../lib/lemmy/rqHooks'
import queryKeys from '../../lib/lemmy/rqKeys'
import { useComposeCommentStore } from '../../stores/compose/composeCommentStore'
import { router } from 'expo-router'
import Loader from '../Core/Loader'

function ActionButton({
  icon,
  active,
  loading,
  onPress
}: {
  icon: IconName
  active?: boolean
  loading?: boolean
  onPress: () => void
}) {
  if (loading) {
    return <Loader micro />
  }
  return (
    <Pressable onPress={onPress}>
      <Icon name={icon} color={active ? '$primaryColor' : '$fadedText'} />
    </Pressable>
  )
}

export default function PostActions({ post }: { post: Lemmy.Data.PostData }) {
  const { mutateAsync: vote, isLoading: voteLoading } = useLemmyMutation(
    'voteOnPost',
    [queryKeys.POST, post.post.id]
  )
  const { mutateAsync: save, isLoading: saveLoading } = useLemmyMutation(
    'savePost',
    [queryKeys.POST, post.post.id]
  )

  return (
    <View
      row
      space
      gap="$0.5"
      backgroundColor="$contentBackground"
      padding="$0.5"
      marginTop={-8}
    >
      <ActionButton
        icon="ThumbsUp"
        active={post.my_vote == 1}
        loading={voteLoading}
        onPress={() =>
          vote({ post_id: post.post.id, score: post.my_vote === 1 ? 0 : 1 })
        }
      />
      <ActionButton
        icon="ThumbsDown"
        active={post.my_vote == -1}
        loading={voteLoading}
        onPress={() =>
          vote({ post_id: post.post.id, score: post.my_vote === -1 ? 0 : -1 })
        }
      />
      <ActionButton
        icon="Bookmark"
        active={post.saved}
        loading={saveLoading}
        onPress={() =>
          save({
            post_id: post.post.id,
            save: !post.saved
          })
        }
      />
      <ActionButton
        icon="Share"
        onPress={() => {
          Share.share({
            message: post.post.body,
            url: post.post.url,
            title: post.post.name
          })
        }}
      />
      <ActionButton
        icon="Link"
        onPress={() => {
          Share.share({
            message: post.post.body,
            url: post.post.ap_id,
            title: post.post.name
          })
        }}
      />
      <ActionButton
        icon="Reply"
        onPress={() => {
          useComposeCommentStore.setState({
            message: '',
            replyingToPost: post
          })
          router.push('/comment/compose')
        }}
      />
    </View>
  )
}
