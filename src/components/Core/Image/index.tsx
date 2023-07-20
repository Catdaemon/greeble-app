import {
  Image as ExpoImage,
  ImageContentFit,
  ImageContentPosition,
  ImageSource,
  ImageStyle
} from 'expo-image'
import Loader from '../Loader'
import { View } from '../View'
import ImageLightbox from '../../MediaLightbox/ImageLightbox'

export interface ImageProps {
  source: ImageSource
  alt?: string
  enableLightbox?: boolean
  style: ImageStyle
  contentFit?: ImageContentFit
  contentPosition?: ImageContentPosition
  blurRadius?: number
}

export default function Image({
  source,
  alt,
  enableLightbox,
  style,
  contentFit,
  contentPosition,
  blurRadius
}: ImageProps) {
  const props = {
    source: {
      ...source,
      headers: {
        ...source?.headers,
        'User-Agent': 'greeble/1'
      }
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
    <ExpoImage {...props} onError={(e) => console.log(e)} />
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
