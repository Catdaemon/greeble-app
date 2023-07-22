import { LinkType } from '../linkInfoTypes'
import isLemmyLink from './isLemmyLink'

const typeMappings = {
  u: LinkType.User,
  c: LinkType.Community
}

export default async function getLocalLinkType(url: string) {
  if (await isLemmyLink(url)) {
    const path = new URL(url).pathname
    const parts = path.split('/')
    const type = parts[1]

    if (typeMappings?.[type]) {
      return typeMappings[type]
    }
  }

  return null
}
