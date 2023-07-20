import { Stack, useRouter } from 'expo-router'
import { useMemo } from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { ScrollView } from 'tamagui'
import AccountRow from '../../../src/components/AccountRow'
import Avatar from '../../../src/components/Avatar'
import Card from '../../../src/components/Card'
import { BodyText, HeadingText } from '../../../src/components/Core/Text'
import { View } from '../../../src/components/Core/View'
import Icon from '../../../src/components/Icon'
import useActiveAccount from '../../../src/hooks/useActiveAccount'
import { useLemmyQuery } from '../../../src/lib/lemmy/rqHooks'
import { Account, useAccountStore } from '../../../src/stores/accountStore'
import queryKeys from '../../../src/lib/lemmy/rqKeys'
import CardRow from '../../../src/components/CardRow'

export default function AccountScreen() {
  const router = useRouter()
  const [accounts] = useAccountStore((state) => [state.accounts])

  const activeAccount = useActiveAccount()

  const { data: myAccountData } = useLemmyQuery(
    'getSite',
    [queryKeys.SITE, activeAccount.accountID],
    {}
  )

  const accountsByServer = useMemo(() => {
    const accountsGroupedByServerUrl: Record<string, Account[]> = {}
    accounts
      .filter((x) => x.accountID !== activeAccount.accountID)
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
        {activeAccount && (
          <>
            <Card center padding="$2" marginBottom="$0.5" gap="$1">
              <HeadingText>Active account</HeadingText>
              {!activeAccount.token ? (
                <Icon name="VenetianMask" size="$4" color="$fadedText" />
              ) : (
                <Avatar
                  size={128}
                  src={myAccountData?.my_user?.local_user_view.person.avatar}
                  placeholderIcon="User"
                />
              )}
              <View center>
                <HeadingText>{activeAccount.username}</HeadingText>
                <BodyText>{activeAccount.serverURL}</BodyText>
              </View>
            </Card>
            <CardRow
              left={<Icon name="Ban" />}
              center={<BodyText>Manage block lists</BodyText>}
              right={<Icon name="ChevronRight" />}
            />
          </>
        )}
        <View flex gap="$1" marginTop="$1">
          {Object.keys(accountsByServer).map((serverURL) => (
            <View key={serverURL} gap="$1">
              <BodyText>{new URL(serverURL).hostname}</BodyText>
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
