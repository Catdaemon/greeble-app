import { Stack, router } from 'expo-router'
import { KeyboardAvoidingView, Pressable } from 'react-native'
import { ScrollView } from 'tamagui'
import FullScreenLoader from '../../src/components/Core/Loader/FullScreenLoader'
import { HeadingText } from '../../src/components/Core/Text'
import { View } from '../../src/components/Core/View'
import Icon from '../../src/components/Icon'
import MarkdownInput from '../../src/components/MarkdownInput'
import MarkdownView from '../../src/components/MarkdownView'
import Message from '../../src/components/Message'
import useActiveAccount from '../../src/hooks/useActiveAccount'
import { useLemmyMutation } from '../../src/lib/lemmy/rqHooks'
import queryKeys from '../../src/lib/lemmy/rqKeys'
import getPostUsername from '../../src/lib/lemmy/util/getPostUsername'
import { useComposeMessageStore } from '../../src/stores/compose/composeMessageStore'

export default function ComposeMessageScreen() {
  const activeAccount = useActiveAccount()
  const [message, replyingTo, toUser, setMessage] = useComposeMessageStore(
    (state) => [state.message, state.replyingTo, state.toUser, state.setMessage]
  )

  const { mutateAsync: sendMessage, isLoading } = useLemmyMutation(
    'sendPrivateMessage',
    [queryKeys.MESSAGES, activeAccount.accountID]
  )

  const onSendPressed = async () => {
    await sendMessage({
      recipient_id: toUser.id,
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
      // behavior="height"
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
        {replyingTo && (
          <>
            <HeadingText marginBottom="$0.5">Replying to</HeadingText>
            <ScrollView
              style={{
                flex: 1,
                maxHeight: 100
              }}
            >
              <Message
                id={replyingTo.private_message.id}
                author={getPostUsername(replyingTo)}
                body={replyingTo.private_message.content}
                date={replyingTo.private_message.published}
              />
            </ScrollView>
          </>
        )}
        <ScrollView
          style={{
            flex: 1
          }}
        >
          <View backgroundColor="$contentBackground" padding="$0.5">
            <MarkdownView content={message} />
          </View>
        </ScrollView>
        <View flex marginTop="$0.5">
          <MarkdownInput value={message} onChangeText={setMessage} />
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}
