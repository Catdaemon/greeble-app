import { ReactNode, useMemo } from 'react'
import { Popover } from 'tamagui'
import useActiveAccount from '../../hooks/useActiveAccount'
import { Account, useAccountStore } from '../../stores/accountStore'
import AccountRow from '../AccountRow'
import { View } from '../Core/View'

export interface AccountSwitcherProps {
  button: ReactNode
  open: boolean
  onOpenChanged: (newVal: boolean) => void
  placement: 'top' | 'bottom'
}

export default function AccountSwitcher({
  button,
  placement,
  open,
  onOpenChanged
}: AccountSwitcherProps) {
  const [accounts] = useAccountStore((state) => [state.accounts])
  const activeAccount = useActiveAccount()

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
    <Popover open={open} onOpenChange={onOpenChanged} placement={placement}>
      <Popover.Anchor>{button}</Popover.Anchor>
      <Popover.Content padding="$0.5" elevate>
        <Popover.Arrow />
        <Popover.Close />
        <Popover.ScrollView>
          <View gap="$0.5">
            {Object.keys(accountsByServer).map((serverURL) =>
              accountsByServer[serverURL].map((account) => (
                <AccountRow key={account.accountID} account={account} />
              ))
            )}
          </View>
        </Popover.ScrollView>
      </Popover.Content>
    </Popover>
  )
}
