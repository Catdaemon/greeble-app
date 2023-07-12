import { LinkType } from '../linkInfoTypes'
import isLocalServerLink from './isLocalServerLink'

const typeMappings = {
  u: LinkType.User,
  c: LinkType.Community
}

export default function getLocalLinkType(url: string) {
  if (isLocalServerLink(url)) {
    const path = new URL(url).pathname
    const parts = path.split('/')
    const type = parts[1]

    if (typeMappings?.[type]) {
      return typeMappings[type]
    }
  }

  return null
}
