import { useAccountStore } from '../../../stores/accountStore'
import { getLemmyInstances } from '../knownLemmyDomains'

export default async function isLemmyLink(url: string) {
  const knownLemmyDomains = (await getLemmyInstances()).map((x) => x.domain)
  const activeAccount = useAccountStore.getState().getActiveAccount()
  try {
    const serverDomain = new URL(activeAccount.serverURL).hostname
    const urlDomain = new URL(url).hostname
    return serverDomain === urlDomain || knownLemmyDomains.includes(urlDomain)
  } catch (e) {
    return false
  }
}
