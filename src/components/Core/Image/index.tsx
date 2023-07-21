import {
  Image as ExpoImage,
  ImageContentFit,
  ImageContentPosition,
  ImageStyle
} from 'expo-image'
import useFileDownload from '../../../hooks/useFileDownload'
import ImageLightbox from '../../MediaLightbox/ImageLightbox'
import Loader from '../Loader'
import { View } from '../View'
import CachedImage from './CachedImage'

export interface ImageProps {
  src: string
  alt?: string
  enableLightbox?: boolean
  style: ImageStyle
  contentFit?: ImageContentFit
  contentPosition?: ImageContentPosition
  blurRadius?: number
  headers?: Record<string, string>
}

export default function Image({
  src,
  alt,
  headers,
  enableLightbox,
  style,
  contentFit,
  contentPosition,
  blurRadius
}: ImageProps) {
  const fileDownload = useFileDownload(src, {
    'User-Agent': 'greeble/1',
    ...headers
  })
  const props = {
    src: fileDownload.filePath,
    style: style,
    contentFit,
    contentPosition,
    blurRadius
  }

  const image = enableLightbox ? (
    <ImageLightbox {...props} />
  ) : (
    <CachedImage
      {...props}
      source={{
        uri: props.src
      }}
    />
  )

  return image
}
