import { ScrollView, TextArea } from 'tamagui'
import { BodyText, HeadingText } from '../../src/components/Core/Text'
import { View } from '../../src/components/Core/View'
import Message from '../../src/components/Message'
import getPostUsername from '../../src/lib/lemmy/util/getPostUsername'
import { useComposeMessageStore } from '../../src/stores/compose/composeMessageStore'
import MarkdownView from '../../src/components/MarkdownView'
import TextInput from '../../src/components/TextInput'
import { KeyboardAvoidingView, Pressable } from 'react-native'
import MarkdownInput from '../../src/components/MarkdownInput'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Stack, router } from 'expo-router'
import Icon from '../../src/components/Icon'
import { useLemmyMutation } from '../../src/lib/lemmy/rqHooks'
import useActiveAccount from '../../src/hooks/useActiveAccount'
import FullScreenLoader from '../../src/components/Core/Loader/FullScreenLoader'
import queryKeys from '../../src/lib/lemmy/rqKeys'

export default function ComposeMessageScreen() {
  const { bottom } = useSafeAreaInsets()
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
        flex: 1,
        marginBottom: bottom
      }}
      behavior="height"
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
      <View flex padding="$0.5">
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
