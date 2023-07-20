import { Stack, useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { ScrollView } from 'react-native-gesture-handler'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview'
import { RadioGroup, XStack } from 'tamagui'
import Card from '../../../src/components/Card'
import Button from '../../../src/components/Core/Button'
import { BodyText, HeadingText } from '../../../src/components/Core/Text'
import { View } from '../../../src/components/Core/View'
import ErrorBox from '../../../src/components/ErrorBox'
import Icon from '../../../src/components/Icon'
import TextInput from '../../../src/components/TextInput'
import { lemmyFetcherFunc } from '../../../src/lib/lemmy/fetchers'
import { useLogin } from '../../../src/lib/lemmy/rqHooks'
import { useAccountStore } from '../../../src/stores/accountStore'

const suggestedServers = [
  'lemmy.ml',
  'lemmy.world',
  'beehaw.org',
  'sh.itjust.works'
]

function usernameOrAnonymous(
  accountType: 'anonymous' | 'login',
  username: string
) {
  if (accountType === 'anonymous') {
    return 'Anonymous'
  } else {
    return username
  }
}

function sanitiseServerUrl(serverUrl: string) {
  let trimmed = serverUrl.toLowerCase().trim()
  if (trimmed.endsWith('/')) {
    trimmed = trimmed.slice(0, -1)
  }
  // Append https if no protocol is specified
  if (!trimmed.startsWith('http')) {
    trimmed = 'https://' + trimmed
  }
  return trimmed
}

export default function AddAccount() {
  const router = useRouter()
  const { mutateAsync, isLoading, isError } = useLogin()
  const [addAccount, setActiveAccount, accounts] = useAccountStore((state) => [
    state.addAccount,
    state.setActiveAccount,
    state.accounts
  ])
  const [siteName, setSiteName] = useState<string>(null)
  const [siteLoading, setSiteLoading] = useState(false)
  const [siteError, setSiteError] = useState(false)

  const getSiteData = async (serverUrl: string) => {
    setSiteLoading(true)
    try {
      const result = await lemmyFetcherFunc<Lemmy.Requests.GetSite.Response>({
        endpoint: '/site',
        method: 'GET',
        serverUrl: serverUrl,
        noAuth: true,
        payload: {} as Lemmy.Requests.GetSite.Request
      })
      const name = result?.site_view?.site?.name
      const desc = result?.site_view?.site?.description
      setSiteName(`${name} - ${desc}`)
      setSiteError(false)
    } catch (e) {
      console.log('fetch error', e.message)
      setSiteError(true)
    } finally {
      setSiteLoading(false)
    }
  }

  const showLemmyHelp = () => {
    alert(`
Lemmy is as a network of different servers that talk to each other.
When you post something on one server, it's visible on all the others.
This is called federation.

Greeble isn't tied to any particular one, so you'll need to tell it
which server to use. You can do so anonymously if you want.
`)
  }

  const [accountType, setAccountType] = useState<'anonymous' | 'login'>(
    'anonymous'
  )
  const [serverUrl, setServerUrl] = useState<string>('')
  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  useEffect(() => {
    if (siteName) {
      setSiteName(null)
    }
    setSiteLoading(false)
    setSiteError(false)
  }, [serverUrl])

  const onSubmit = async () => {
    let token = null
    if (accountType === 'login') {
      const result = await mutateAsync({
        serverURL: sanitiseServerUrl(serverUrl),
        username: accountType === 'login' ? username : undefined,
        password: accountType === 'login' ? password : undefined
      })
      if (!result.jwt) {
        // TODO: something?
      }
      token = result.jwt
    }
    const newID = addAccount({
      token: token,
      username: usernameOrAnonymous(accountType, username),
      serverURL: sanitiseServerUrl(serverUrl)
    })
    setActiveAccount(newID)
    router.back()
  }

  const accountAlreadyExists = accounts.some(
    (account) =>
      account.serverURL === serverUrl &&
      account.username === usernameOrAnonymous(accountType, username)
  )

  // TODO: proper validation

  return (
    <KeyboardAwareScrollView>
      <Stack.Screen options={{ title: 'Add Account' }} />
      <View paddingHorizontal="$0.5" paddingTop="$0.5" gap="$1">
        <Card>
          {!siteName && (
            <>
              <View row centerV gap="$0.5">
                <HeadingText>Which server?</HeadingText>
                <Button
                  onPress={showLemmyHelp}
                  size="small"
                  variant="ghost"
                  icon={() => <Icon name="HelpCircle" color="$textColor" />}
                />
              </View>
              <BodyText>
                Some popular options are listed below, or you can enter your
                own.
              </BodyText>
              <ScrollView horizontal>
                <XStack marginVertical="$1" gap="$0.5">
                  {suggestedServers.map((url) => (
                    <Button
                      key={url}
                      size="medium"
                      variant="secondary"
                      onPress={() => setServerUrl(url)}
                      label={url}
                    />
                  ))}
                </XStack>
              </ScrollView>
            </>
          )}
          <View>
            <TextInput
              key="serverUrl"
              label="Server URL"
              value={serverUrl}
              onChangeText={(newVal) => setServerUrl(newVal)}
            />
            {siteName ? (
              <View row center gap="$0.5" marginVertical="$0.5">
                <Icon name="CheckCircle" />
                <BodyText flex>{siteName}</BodyText>
              </View>
            ) : (
              <>
                {siteError && (
                  <ErrorBox error="Something went wrong. Please check the URL and try again." />
                )}

                <Button
                  marginTop="$1"
                  onPress={() => getSiteData(sanitiseServerUrl(serverUrl))}
                  variant="primary"
                  size="medium"
                  label="Check URL"
                  loading={siteLoading}
                />
              </>
            )}
          </View>
        </Card>
        {siteName && (
          <>
            <Card padding="$1">
              <HeadingText>Do you want to log in?</HeadingText>
              <RadioGroup
                marginTop="$1"
                gap="$0.5"
                value={accountType}
                onValueChange={(newVal) => {
                  setAccountType(newVal as any)
                }}
              >
                <View row centerV gap="$0.5">
                  <RadioGroup.Item value="anonymous" size="$3">
                    <RadioGroup.Indicator borderColor="$primaryColor" />
                  </RadioGroup.Item>
                  <BodyText>No - browse anonymously</BodyText>
                </View>
                <View row centerV gap="$0.5">
                  <RadioGroup.Item value="login" size="$3">
                    <RadioGroup.Indicator borderColor="$primaryColor" />
                  </RadioGroup.Item>
                  <BodyText>Yes - post, comment, and save</BodyText>
                </View>
              </RadioGroup>
            </Card>
            {accountType === 'login' && (
              <Card padding="$1" gap="$0.5">
                <HeadingText>Enter your credentials</HeadingText>
                <TextInput
                  label="Username"
                  value={username}
                  onChangeText={(newVal) => setUsername(newVal)}
                />
                <TextInput
                  label="Password"
                  value={password}
                  onChangeText={(newVal) => setPassword(newVal)}
                  secureTextEntry
                />
              </Card>
            )}

            {isError && (
              <ErrorBox error="Something went wrong. Check that your credentisl are correct and try again." />
            )}

            <Button onPress={onSubmit} variant="primary" loading={isLoading}>
              Add Account
            </Button>
          </>
        )}
      </View>
    </KeyboardAwareScrollView>
  )
}
