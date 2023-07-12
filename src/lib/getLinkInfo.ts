import { IconName } from '../components/Icon'
import { useAccountStore } from '../stores/accountStore'
import {
  LinkInfo,
  LinkSource,
  LinkSourceColors,
  LinkSourceIcons,
  LinkSourceNames,
  LinkSourceRegex,
  LinkSourceType,
  LinkType,
  LinkTypeIcon
} from './lemmy/linkInfoTypes'
import getLocalLinkType from './lemmy/util/getLocalLinkType'

function getLinkSourceFromUrl(url?: string) {
  const keys = (Object.keys(LinkSourceRegex) as unknown as LinkSource[]).filter(
    (key) => key != LinkSource.Unknown
  )
  for (const source of keys) {
    const regex = LinkSourceRegex[source]
    if (url?.match(regex)) {
      return Number(source)
    }
  }
  return LinkSource.Unknown
}

function getThumbnailUrl(source: LinkSource, url?: string) {
  // return youtube thumbnail
  if (source == LinkSource.YouTube) {
    const videoId = getYouTubeVideoId(url)
    return `https://img.youtube.com/vi/${videoId}/0.jpg`
  }
  return undefined
}

export function urlIsImage(url?: string) {
  const matchResult = url
    ?.trim()
    .match(/\.(jpeg|jpg|gif|png|webp|apng|svg|heic|avif)$/)
  return !!matchResult
}

export function urlIsVideo(url?: string) {
  const matchResult = url?.trim().match(/\.(webm|mp4|gifv)$/)
  return !!matchResult
}

export function getYouTubeVideoId(url?: string) {
  const youtubeVideoIdRegex =
    /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/
  const matchResult = url?.match(youtubeVideoIdRegex)
  return matchResult && matchResult[7]
}

function urlIsLocalServer(url: string) {
  const activeAccount = useAccountStore.getState().getActiveAccount()
  if (activeAccount) {
    return url?.startsWith(activeAccount.serverURL) ?? false
  }
  return false
}

function getUrlDomain(url: string) {
  try {
    const result = new URL(url)
    return result.hostname
  } catch (e) {
    return 'Invalid URL'
  }
}

export default function getLinkInfo(url?: string): LinkInfo {
  if (!url) {
    return {
      type: LinkType.Link,
      source: LinkSource.Unknown,
      name: 'Unknown',
      url: '',
      icon: 'Compass',
      isLocal: false,
      domain: getUrlDomain(url),
      color: LinkSourceColors[LinkSource.Unknown]
    }
  }
  const isLocalServer = urlIsLocalServer(url)
  const localType = isLocalServer ? getLocalLinkType(url) : null
  const source = getLinkSourceFromUrl(url)
  const type = localType
    ? localType
    : urlIsImage(url)
    ? LinkType.Image
    : urlIsVideo(url) && source != LinkSource.YouTube
    ? LinkType.Video
    : LinkSourceType[source]

  const icon = localType
    ? LinkTypeIcon[localType]
    : isLocalServer
    ? 'FileText'
    : source === LinkSource.Unknown
    ? LinkTypeIcon[type]
    : type === LinkType.Video && source != LinkSource.YouTube
    ? 'Video'
    : LinkSourceIcons[source]

  return {
    type: type,
    source,
    name: LinkSourceNames[source],
    url,
    icon,
    thumbnailUrl: getThumbnailUrl(source, url),
    isLocal: isLocalServer,
    domain: getUrlDomain(url),
    color: LinkSourceColors[source]
  }
}
