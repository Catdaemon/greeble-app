import useActiveAccount from './useActiveAccount'

export default function useLocalServerDomain() {
  const activeAccount = useActiveAccount()
  return new URL(activeAccount.serverURL).hostname
}
