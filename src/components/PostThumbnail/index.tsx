import { useEffect, useMemo, useState } from 'react'
import { DimensionValue, Pressable, View } from 'react-native'
import { useTheme } from 'tamagui'
import getLinkInfo from '../../lib/getLinkInfo'
import { LinkInfo, LinkSource, LinkType } from '../../lib/lemmy/linkInfoTypes'
import openLink from '../../lib/openLink'
import Image from '../Core/Image'
import { BodyText } from '../Core/Text'
import Icon from '../Icon'
import IconOverlay from '../IconOverlay'
import VideoLightbox from '../MediaLightbox/VideoLightbox'

const THUMB_SIZE = 72

export interface PostThumbnailProps {
  imageUrl?: string
  videoUrl?: string
  linkUrl?: string
  blur?: boolean
  thumbSize?: DimensionValue
  contain?: boolean
  square?: boolean
}

function Thumbnail({
  imageUrl,
  videoUrl,
  linkUrl,
  blur,
  linkInfo,
  contain,
  square = true,
  thumbSize = THUMB_SIZE
}: PostThumbnailProps & {
  linkInfo: LinkInfo
}) {
  const theme = useTheme()

  if (linkInfo.type === LinkType.Video) {
    return (
      <VideoLightbox
        sourceType={linkInfo.source}
        linkInfo={linkInfo}
        thumbSize={thumbSize}
        square={square}
        blur={blur}
        thumbnailUrl={imageUrl ?? linkInfo.thumbnailUrl}
      />
    )
  }
  if (linkInfo.type === LinkType.ImageAlbum) {
    return <BodyText>Album</BodyText>
  }
  if (linkUrl) {
    if (linkInfo.type === LinkType.Image) {
      const image = (
        <Image
          enableLightbox
          blurRadius={blur ? 100 : 0}
          source={{
            uri: imageUrl ?? linkUrl
          }}
          contentFit={contain ? 'contain' : 'cover'}
          style={{
            aspectRatio: square ? 1 : 16 / 9,
            width: thumbSize
          }}
        />
      )
      if (linkInfo.source != LinkSource.Unknown) {
        return (
          <IconOverlay icon={linkInfo.icon} iconColor={linkInfo.color}>
            {image}
          </IconOverlay>
        )
      } else {
        return image
      }
    }
    return (
      <Pressable onPress={() => openLink(linkUrl)}>
        {imageUrl ? (
          <IconOverlay icon={linkInfo.icon} iconColor={linkInfo.color}>
            <Image
              contentFit={contain ? 'contain' : 'cover'}
              source={{
                uri: imageUrl
              }}
              style={{
                aspectRatio: square ? 1 : 16 / 9,
                width: thumbSize
              }}
            />
          </IconOverlay>
        ) : (
          <Icon
            name={linkInfo.icon}
            size={thumbSize as string | number}
            color={theme.fadedText.get()}
          />
        )}
      </Pressable>
    )
  }

  return (
    <Icon
      name="FileText"
      size={thumbSize as string | number}
      color="$fadedText"
    />
  )
}

export default function PostThumbnail(props: PostThumbnailProps) {
  const linkInfoUrl = props.linkUrl ?? props.imageUrl
  const [linkInfo, setLinkInfo] = useState<LinkInfo>(null)

  useEffect(() => {
    if (!linkInfoUrl) return
    getLinkInfo(linkInfoUrl).then(setLinkInfo)
  }, [linkInfoUrl])

  if (!linkInfo) return null

  return (
    <View>
      <Thumbnail {...props} linkInfo={linkInfo} />
    </View>
  )
}
