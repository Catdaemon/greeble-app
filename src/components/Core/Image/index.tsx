import {
  Image as ExpoImage,
  ImageContentFit,
  ImageContentPosition,
  ImageStyle
} from 'expo-image'
import Loader from '../Loader'
import { View } from '../View'
import ImageLightbox from '../../MediaLightbox/ImageLightbox'

export interface ImageProps {
  src: string
  alt?: string
  enableLightbox?: boolean
  style: ImageStyle
  contentFit?: ImageContentFit
  contentPosition?: ImageContentPosition
  blurRadius?: number
}

export default function Image({
  src,
  alt,
  enableLightbox,
  style,
  contentFit,
  contentPosition,
  blurRadius
}: ImageProps) {
  const props = {
    source: {
      uri: src
    },
    style: style,
    // cachePolicy: 'disk' as any,
    contentFit,
    contentPosition,
    blurRadius
  }

  const image = enableLightbox ? (
    <ImageLightbox {...props} />
  ) : (
    <ExpoImage {...props} />
  )

  const withWrapper = (
    <View>
      {false && (
        <View
          position="absolute"
          top={0}
          left={0}
          aspectRatio={1}
          width={style?.width}
          height={style?.height}
          center
        >
          <Loader />
        </View>
      )}
      {image}
    </View>
  )

  return withWrapper
}
