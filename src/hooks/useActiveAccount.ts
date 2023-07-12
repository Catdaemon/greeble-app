import { useAccountStore } from '../stores/accountStore'

export default function useActiveAccount() {
  const [accounts, activeAccount] = useAccountStore((state) => [
    state.accounts,
    state.activeAccount
  ])
  if (activeAccount) {
    return accounts.find((x) => x.accountID === activeAccount)
  } else {
    return null
  }
}
