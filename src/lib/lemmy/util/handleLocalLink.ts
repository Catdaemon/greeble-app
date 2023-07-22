import { router } from 'expo-router'
import isLemmyLink from './isLemmyLink'
import useActiveAccount from '../../../hooks/useActiveAccount'
import { useAccountStore } from '../../../stores/accountStore'

const typeHandlers = {
  post: (id: string) => {
    router.push(`/comments/${id}`)
  },
  u: (id: string) => {
    router.push(`/user/${id}`)
  },
  user: (id: string) => {
    router.push(`/user/${id}`)
  },
  c: (id: string) => {
    router.push(`/community/${id}`)
  },
  community: (id: string) => {
    router.push(`/community/${id}`)
  }
}

export default async function handleLocalLink(url: string) {
  const startsWithSlash = url.startsWith('/')
  const isLemmy = await isLemmyLink(url)
  const localDomain = new URL(
    useAccountStore.getState().getActiveAccount().serverURL
  ).hostname
  const domain = startsWithSlash ? '' : `@${new URL(url).hostname}`

  if (isLemmy || startsWithSlash) {
    const path = startsWithSlash ? url : new URL(url).pathname
    const parts = path.split('/')
    const type = parts[1]
    const id = `${parts[2]}${domain}`

    console.log('local link', type, id)

    if (typeHandlers[type]) {
      typeHandlers[type](id)
    } else {
      return false
    }

    return true
  }

  return false
}
