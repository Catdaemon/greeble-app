import { IconName } from '../../components/Icon'

export const enum LinkSource {
  Unknown = 0,
  YouTube,
  Vimeo,
  Twitter,
  Reddit,
  Instagram,
  Facebook,
  TikTok,
  Twitch,
  Spotify,
  SoundCloud,
  AppleMusic,
  Bandcamp,
  GitHub,
  LinkedIn,
  ImgurAlbum,
  RedGifs
}

export const LinkSourceIcons: Record<LinkSource, IconName> = {
  [LinkSource.Unknown]: 'Compass',
  [LinkSource.YouTube]: 'Youtube',
  [LinkSource.Vimeo]: 'MonitorPlay',
  [LinkSource.Twitter]: 'Twitter',
  [LinkSource.Reddit]: 'LayoutList',
  [LinkSource.Instagram]: 'Instagram',
  [LinkSource.Facebook]: 'Facebook',
  [LinkSource.TikTok]: 'MonitorPlay',
  [LinkSource.Twitch]: 'Twitch',
  [LinkSource.Spotify]: 'Music',
  [LinkSource.SoundCloud]: 'Music',
  [LinkSource.AppleMusic]: 'Music',
  [LinkSource.Bandcamp]: 'Music',
  [LinkSource.GitHub]: 'Github',
  [LinkSource.LinkedIn]: 'Linkedin',
  [LinkSource.ImgurAlbum]: 'MonitorPlay',
  [LinkSource.RedGifs]: 'MonitorPlay'
}

export const LinkSourceNames: Record<LinkSource, string> = {
  [LinkSource.Unknown]: 'Unknown',
  [LinkSource.YouTube]: 'YouTube',
  [LinkSource.Vimeo]: 'Vimeo',
  [LinkSource.Twitter]: 'Twitter',
  [LinkSource.Reddit]: 'Reddit',
  [LinkSource.Instagram]: 'Instagram',
  [LinkSource.Facebook]: 'Facebook',
  [LinkSource.TikTok]: 'TikTok',
  [LinkSource.Twitch]: 'Twitch',
  [LinkSource.Spotify]: 'Spotify',
  [LinkSource.SoundCloud]: 'SoundCloud',
  [LinkSource.AppleMusic]: 'Apple Music',
  [LinkSource.Bandcamp]: 'Bandcamp',
  [LinkSource.GitHub]: 'GitHub',
  [LinkSource.LinkedIn]: 'LinkedIn',
  [LinkSource.ImgurAlbum]: 'Imgur',
  [LinkSource.RedGifs]: 'RedGifs'
}

export const LinkSourceRegex: Record<LinkSource, RegExp> = {
  [LinkSource.YouTube]:
    /^(?:https?:\/\/)?(?:www\.)?(?:(?:youtube\.com)|(?:youtu\.be))\/(.*)$/,
  [LinkSource.Vimeo]:
    /(?:https?:\/\/)?(?:www\.)?(?:vimeo\.com)\/(?:watch\?v=)?(.+)/,
  [LinkSource.Twitter]:
    /(?:https?:\/\/)?(?:www\.)?(?:twitter\.com)\/(?:watch\?v=)?(.+)/,
  [LinkSource.Reddit]:
    /(?:https?:\/\/)?(?:www\.)?(?:reddit\.com)\/(?:watch\?v=)?(.+)/,
  [LinkSource.Instagram]:
    /(?:https?:\/\/)?(?:www\.)?(?:instagram\.com)\/(?:watch\?v=)?(.+)/,
  [LinkSource.Facebook]:
    /(?:https?:\/\/)?(?:www\.)?(?:facebook\.com)\/(?:watch\?v=)?(.+)/,
  [LinkSource.TikTok]:
    /(?:https?:\/\/)?(?:www\.)?(?:tiktok\.com)\/(?:watch\?v=)?(.+)/,
  [LinkSource.Twitch]:
    /(?:https?:\/\/)?(?:www\.)?(?:twitch\.tv)\/(?:watch\?v=)?(.+)/,
  [LinkSource.Spotify]:
    /(?:https?:\/\/)?(?:www\.)?(?:spotify\.com)\/(?:watch\?v=)?(.+)/,
  [LinkSource.SoundCloud]:
    /(?:https?:\/\/)?(?:www\.)?(?:soundcloud\.com)\/(?:watch\?v=)?(.+)/,
  [LinkSource.AppleMusic]:
    /(?:https?:\/\/)?(?:www\.)?(?:music\.apple\.com)\/(?:watch\?v=)?(.+)/,
  [LinkSource.Bandcamp]:
    /(?:https?:\/\/)?(?:www\.)?(?:bandcamp\.com)\/(?:watch\?v=)?(.+)/,
  [LinkSource.GitHub]:
    /(?:https?:\/\/)?(?:www\.)?(?:github\.com)\/(?:watch\?v=)?(.+)/,
  [LinkSource.LinkedIn]:
    /(?:https?:\/\/)?(?:www\.)?(?:linkedin\.com)\/(?:watch\?v=)?(.+)/,
  [LinkSource.ImgurAlbum]: /https?:\/\/(?:www\.)?imgur\.com\/a\/[^\s\/]+/,
  [LinkSource.RedGifs]: /https?:\/\/(?:.*)?redgifs\.com\/(.*)$/,
  [LinkSource.Unknown]: /(.*)/
}

export const LinkSourceColors: Record<LinkSource, string> = {
  [LinkSource.Unknown]: '#000000',
  [LinkSource.YouTube]: '#FF0000',
  [LinkSource.Vimeo]: '#1AB7EA',
  [LinkSource.Twitter]: '#1DA1F2',
  [LinkSource.Reddit]: '#FF4500',
  [LinkSource.Instagram]: '#E1306C',
  [LinkSource.Facebook]: '#4267B2',
  [LinkSource.TikTok]: '#000000',
  [LinkSource.Twitch]: '#9146FF',
  [LinkSource.Spotify]: '#1DB954',
  [LinkSource.SoundCloud]: '#FF5500',
  [LinkSource.AppleMusic]: '#FF2D55',
  [LinkSource.Bandcamp]: '#629AA9',
  [LinkSource.GitHub]: '#000000',
  [LinkSource.LinkedIn]: '#0A66C2',
  [LinkSource.ImgurAlbum]: '#1BB76E',
  [LinkSource.RedGifs]: '#FF0000'
}

export const enum LinkType {
  Video,
  Audio,
  Image,
  Link,
  ImageAlbum,
  User,
  Community,
  Post
}

export const LinkTypeIcon: Record<LinkType, IconName> = {
  [LinkType.Video]: 'Video',
  [LinkType.Audio]: 'Music',
  [LinkType.Image]: 'Image',
  [LinkType.ImageAlbum]: 'Image',
  [LinkType.Link]: 'Compass',
  [LinkType.User]: 'User',
  [LinkType.Community]: 'Users',
  [LinkType.Post]: 'FileText'
}

export const LinkSourceType: Record<LinkSource, LinkType> = {
  [LinkSource.YouTube]: LinkType.Video,
  [LinkSource.Vimeo]: LinkType.Video,
  [LinkSource.Twitter]: LinkType.Link,
  [LinkSource.Reddit]: LinkType.Link,
  [LinkSource.Instagram]: LinkType.Image,
  [LinkSource.Facebook]: LinkType.Link,
  [LinkSource.TikTok]: LinkType.Video,
  [LinkSource.Twitch]: LinkType.Video,
  [LinkSource.Spotify]: LinkType.Audio,
  [LinkSource.SoundCloud]: LinkType.Audio,
  [LinkSource.AppleMusic]: LinkType.Audio,
  [LinkSource.Bandcamp]: LinkType.Audio,
  [LinkSource.GitHub]: LinkType.Link,
  [LinkSource.LinkedIn]: LinkType.Link,
  [LinkSource.ImgurAlbum]: LinkType.ImageAlbum,
  [LinkSource.Unknown]: LinkType.Link,
  [LinkSource.RedGifs]: LinkType.Video
}

export interface LinkInfo {
  type: LinkType
  source: LinkSource
  name: string
  url: string
  domain: string
  icon: IconName
  thumbnailUrl?: string
  isLocal: boolean
  color: string
  bearerToken?: string
}
