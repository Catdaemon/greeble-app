import { useLemmyQuery } from '../lib/lemmy/rqHooks'
import queryKeys from '../lib/lemmy/rqKeys'
import useActiveAccount from './useActiveAccount'

export default function useActiveAccountData() {
  const activeAccount = useActiveAccount()
  const { data, isLoading } = useLemmyQuery(
    'getSite',
    [queryKeys.SITE, activeAccount.accountID],
    {}
  )

  var accountData = data?.my_user?.local_user_view

  return { accountData, isLoading }
}
