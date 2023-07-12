import { router } from 'expo-router'
import isLocalServerLink from './isLocalServerLink'

const typeHandlers = {
  post: (id: string) => {
    router.push(`/comments/${id}`)
  },
  u: (id: string) => {
    router.push(`/user/${id}`)
  },
  c: (id: string) => {
    router.push(`/community/${id}`)
  }
}

export default function handleLocalLink(url: string) {
  if (isLocalServerLink(url)) {
    const path = new URL(url).pathname
    const parts = path.split('/')
    const type = parts[1]
    const id = parts[2]

    if (typeHandlers[type]) {
      typeHandlers[type](id)
    } else {
      return false
    }

    return true
  }

  return false
}
