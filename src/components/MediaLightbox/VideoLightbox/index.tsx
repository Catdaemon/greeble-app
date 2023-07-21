import { Video } from 'expo-av'
import { DimensionValue } from 'react-native'
import MediaLightbox from '..'
import { LinkInfo, LinkSource } from '../../../lib/lemmy/linkInfoTypes'
import Image from '../../Core/Image'
import FullScreenLoader from '../../Core/Loader/FullScreenLoader'
import { View } from '../../Core/View'
import IconOverlay from '../../IconOverlay'
import { YouTubeVideo } from '../../YouTubeVideo'
import { useAppSettingsStore } from '../../../stores/appSettingsStore'

export interface VideoLightboxProps {
  linkInfo: LinkInfo
  thumbnailUrl?: string
  sourceType: LinkSource
  thumbSize: DimensionValue
  square?: boolean
  blur?: boolean
}

function RenderGenericVideo({ videoUrl }: { videoUrl: string }) {
  return (
    <Video
      source={{
        uri: videoUrl.replace('gifv', 'mp4'),
        headers: {
          'User-Agent': 'greeble/1'
        }
      }}
      style={{
        height: '100%',
        width: '100%'
      }}
      useNativeControls
      isLooping
      shouldPlay
      isMuted
    >
      <FullScreenLoader />
    </Video>
  )
}

function RenderYouTubeVideo({ videoUrl }: { videoUrl: string }) {
  return (
    <View marginVertical="$2" flex>
      <YouTubeVideo videoUrl={videoUrl} autoPlay />
    </View>
  )
}

function RenderVideo({
  videoUrl,
  sourceType
}: {
  videoUrl: string
  sourceType: LinkSource
}) {
  switch (sourceType) {
    case LinkSource.YouTube:
      return <RenderYouTubeVideo videoUrl={videoUrl} />
    default:
      return <RenderGenericVideo videoUrl={videoUrl} />
  }
}

export default function VideoLightbox({
  linkInfo,
  sourceType,
  thumbnailUrl,
  thumbSize = 72,
  square = false,
  blur = false
}: VideoLightboxProps) {
  const handleYouTube = useAppSettingsStore(
    (state) => state.handleYouTubeVideos
  )
  if (!linkInfo) return null

  const srcProp = {
    uri: linkInfo.thumbnailUrl ?? thumbnailUrl,
    headers: {
      Authorization: `Bearer ${linkInfo.bearerToken}`
    }
  }

  const thumbnail = (
    <IconOverlay
      icon={linkInfo.source === LinkSource.Unknown ? 'Video' : linkInfo.icon}
      iconColor={linkInfo.color}
    >
      {linkInfo.thumbnailUrl || thumbnailUrl ? (
        <Image
          contentFit="cover"
          src={srcProp.uri}
          blurRadius={blur ? 100 : 0}
          style={{
            aspectRatio: square ? 1 : 16 / 9,
            width: thumbSize
          }}
        />
      ) : (
        <View aspectRatio={square ? 1 : 16 / 9} width={thumbSize} />
      )}
    </IconOverlay>
  )

  const content = (
    <RenderVideo videoUrl={linkInfo.url} sourceType={sourceType} />
  )

  return (
    <>
      <MediaLightbox
        content={content}
        thumbnail={thumbnail}
        contentUrl={linkInfo.url}
        enableLightbox={handleYouTube || linkInfo.source !== LinkSource.YouTube}
      />
    </>
  )
}
