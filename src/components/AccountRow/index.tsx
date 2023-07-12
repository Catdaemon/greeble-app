import { Pressable } from 'react-native'
import Swipeable from 'react-native-gesture-handler/Swipeable'
import { useTheme } from 'tamagui'
import { Account, useAccountStore } from '../../stores/accountStore'
import Card from '../Card'
import { BodyText } from '../Core/Text'
import { View } from '../Core/View'
import Icon from '../Icon'

interface AccountRowProps {
  account: Account
}

export default function AccountRow({ account }: AccountRowProps) {
  const theme = useTheme()
  const [setActiveAccount, removeAccount] = useAccountStore((state) => [
    state.setActiveAccount,
    state.removeAccount
  ])

  return (
    <Swipeable
      overshootLeft={false}
      renderLeftActions={(progress, dragX) => {
        return (
          <Pressable
            onPress={() => removeAccount(account.accountID)}
            style={{
              height: 'auto',
              width: 100,
              backgroundColor: theme.errorBackground.get(),
              padding: 16,
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <BodyText bold color="$errorText">
              Delete
            </BodyText>
          </Pressable>
        )
      }}
    >
      <Card
        key={account.accountID}
        gap="$0.5"
        onPress={() => {
          setActiveAccount(account.accountID)
        }}
        row
        centerV
        justifyContent="space-between"
      >
        <View row gap="$0.5" centerV>
          {!account.token ? (
            <Icon name="VenetianMask" size="$2" color="$fadedText" />
          ) : (
            <Icon name="User" size="$2" color="$fadedText" />
          )}
          <View>
            <BodyText bold>{account.username}</BodyText>
            <BodyText>{account.serverURL}</BodyText>
          </View>
        </View>
        <Icon name="ArrowRightLeft" />
      </Card>
    </Swipeable>
  )
}
