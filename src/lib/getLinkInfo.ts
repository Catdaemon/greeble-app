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

async function getRedGifsVideoInfo(url?: string) {
  const end = url?.split('/').pop()

  try {
    const apiKey = await getLinkBearerToken(LinkSource.RedGifs)
    const apiUrl = `https://api.redgifs.com/v2/gifs/${end}`
    const resp = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'User-Agent': 'greeble/1'
      },
      credentials: 'include'
    })
    const json = await resp.json()
    return {
      url: json.gif.urls.hd,
      thumbnail: json.gif.urls.thumbnail
    }
  } catch (e) {
    return {
      url: '',
      thumbnail: ''
    }
  }
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

const redGifsApiKey = ''

export async function getLinkBearerToken(source: LinkSource) {
  if (source === LinkSource.RedGifs) {
    if (redGifsApiKey) return redGifsApiKey

    try {
      const result = await fetch('https://api.redgifs.com/v2/auth/temporary', {
        headers: {
          'User-Agent': 'greeble/1'
        }
      })
      const json = await result.json()
      return json.token as string
    } catch (e) {
      return undefined
    }
  }

  return undefined
}

async function getLinkUrls(source: LinkSource, url?: string) {
  if (source === LinkSource.RedGifs) {
    return await getRedGifsVideoInfo(url)
  }
  return {
    url: url,
    thumbnail: getThumbnailUrl(source, url)
  }
}

export default async function getLinkInfo(url?: string): Promise<LinkInfo> {
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

  const linkUrls = await getLinkUrls(source, url)

  return {
    type: type,
    source,
    name: LinkSourceNames[source],
    url: linkUrls.url,
    icon,
    thumbnailUrl: linkUrls.thumbnail,
    isLocal: isLocalServer,
    domain: getUrlDomain(url),
    color: LinkSourceColors[source],
    bearerToken: await getLinkBearerToken(source)
  }
}
