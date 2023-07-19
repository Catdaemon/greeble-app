import { Stack, router } from 'expo-router'
import { KeyboardAvoidingView, Pressable } from 'react-native'
import { ScrollView } from 'tamagui'
import Comment from '../../src/components/Comment'
import FullScreenLoader from '../../src/components/Core/Loader/FullScreenLoader'
import { HeadingText } from '../../src/components/Core/Text'
import { View } from '../../src/components/Core/View'
import Icon from '../../src/components/Icon'
import MarkdownInput from '../../src/components/MarkdownInput'
import MarkdownView from '../../src/components/MarkdownView'
import { useLemmyMutation } from '../../src/lib/lemmy/rqHooks'
import queryKeys from '../../src/lib/lemmy/rqKeys'
import getPostUsername from '../../src/lib/lemmy/util/getPostUsername'
import { useComposeCommentStore } from '../../src/stores/compose/composeCommentStore'

export default function ComposeCommentScreen() {
  const [message, replyingToComment, replyingToPost, setMessage] =
    useComposeCommentStore((state) => [
      state.message,
      state.replyingToComment,
      state.replyingToPost,
      state.setMessage
    ])

  const { mutateAsync: addComment, isLoading } = useLemmyMutation(
    'addComment',
    [
      queryKeys.POSTCOMMENTS,
      replyingToPost?.post?.id ?? replyingToComment?.post?.id
    ]
  )

  const onSendPressed = async () => {
    await addComment({
      post_id: replyingToPost?.post?.id ?? replyingToComment?.post?.id,
      parent_id: replyingToComment?.comment?.id,
      content: message
    })
    router.back()
  }

  if (isLoading) {
    return <FullScreenLoader />
  }

  return (
    <KeyboardAvoidingView
      style={{
        flex: 1
      }}
      //behavior=""
      keyboardVerticalOffset={120}
    >
      <Stack.Screen
        options={{
          headerRight: () => (
            <Pressable onPress={onSendPressed}>
              <Icon name="Send" />
            </Pressable>
          )
        }}
      />
      <View flex paddingHorizontal="$0.5" paddingTop="$0.5">
        {replyingToComment && (
          <>
            <HeadingText marginBottom="$0.5">Replying to</HeadingText>
            <ScrollView
              style={{
                flex: 1,
                maxHeight: 150
              }}
            >
              <Comment
                author={getPostUsername(replyingToComment)}
                body={replyingToComment.comment.content}
                date={replyingToComment.comment.published}
                upvotes={replyingToComment.counts.upvotes}
                downvotes={replyingToComment.counts.downvotes}
                myVote={replyingToComment.my_vote}
                replyCount={replyingToComment.counts.comments}
                depth={0}
                id={replyingToComment.comment.id}
                path={replyingToComment.comment.path}
                saved={replyingToComment.saved}
                onActionPerformed={() => {}}
              />
            </ScrollView>
          </>
        )}
        <ScrollView
          style={{
            flex: 1,
            marginTop: 8
          }}
        >
          <View backgroundColor="$contentBackground" padding="$0.5">
            <MarkdownView
              content={message || 'Message preview will appear here'}
            />
          </View>
        </ScrollView>
        <View flex marginTop="$0.5">
          <MarkdownInput value={message} onChangeText={setMessage} />
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}
