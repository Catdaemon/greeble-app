import { Stack, useRouter } from 'expo-router'
import { useMemo } from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { ScrollView, useTheme } from 'tamagui'
import AccountRow from '../../../src/components/AccountRow'
import Card from '../../../src/components/Card'
import { BodyText, HeadingText } from '../../../src/components/Core/Text'
import { View } from '../../../src/components/Core/View'
import Icon from '../../../src/components/Icon'
import { Account, useAccountStore } from '../../../src/stores/accountStore'
import { useLemmyQuery } from '../../../src/lib/lemmy/rqHooks'
import Avatar from '../../../src/components/Avatar'

export default function AccountScreen() {
  const theme = useTheme()
  const router = useRouter()
  const [accounts, activeAccount] = useAccountStore((state) => [
    state.accounts,
    state.activeAccount
  ])

  const activeAccountDetails = useMemo(() => {
    return accounts.find((x) => x.accountID === activeAccount)
  }, [accounts, activeAccount])

  const { data: myAccountData } = useLemmyQuery('getSite', [activeAccount], {})

  const accountsByServer = useMemo(() => {
    const accountsGroupedByServerUrl: Record<string, Account[]> = {}
    accounts
      .filter((x) => x.accountID !== activeAccount)
      .forEach((account) => {
        if (!accountsGroupedByServerUrl[account.serverURL]) {
          accountsGroupedByServerUrl[account.serverURL] = []
        }
        accountsGroupedByServerUrl[account.serverURL].push(account)
      })
    return accountsGroupedByServerUrl
  }, [accounts, activeAccount])

  return (
    <View flex padding="$0.5">
      <Stack.Screen
        options={{
          title: 'Account',
          headerRight: () => (
            <TouchableOpacity onPress={() => router.push('/tabs/account/add')}>
              <Icon name="Plus" />
            </TouchableOpacity>
          )
        }}
      />
      <ScrollView flex={1}>
        {activeAccountDetails && (
          <Card center padding="$2" marginBottom="$1" gap="$1">
            <HeadingText>Active account</HeadingText>
            {!activeAccountDetails.token ? (
              <Icon name="VenetianMask" size="$4" color="$fadedText" />
            ) : (
              <Avatar
                size={128}
                src={myAccountData?.my_user.local_user_view.person.avatar}
                placeholderIcon="User"
              />
            )}
            <View center>
              <HeadingText>{activeAccountDetails.username}</HeadingText>
              <BodyText>{activeAccountDetails.serverURL}</BodyText>
            </View>
          </Card>
        )}
        <View flex gap="$2">
          {Object.keys(accountsByServer).map((serverURL) => (
            <View key={serverURL} gap="$1">
              <HeadingText>{serverURL}</HeadingText>
              {accountsByServer[serverURL].map((account) => (
                <AccountRow key={account.accountID} account={account} />
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  )
}
