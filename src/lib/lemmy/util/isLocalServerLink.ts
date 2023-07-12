import { useAccountStore } from '../../../stores/accountStore'

export default function isLocalServerLink(url: string) {
  const activeAccount = useAccountStore.getState().getActiveAccount()
  try {
    const serverDomain = new URL(activeAccount.serverURL).hostname
    const urlDomain = new URL(url).hostname
    return serverDomain === urlDomain
  } catch (e) {
    return false
  }
}
