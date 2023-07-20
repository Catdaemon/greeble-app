import { Image, ImageProps } from 'expo-image'
import { useAppSettingsStore } from '../../../stores/appSettingsStore'
import Icon from '../../Icon'
import MediaLightbox from '..'

export default function ImageLightbox(props: ImageProps) {
  const [loadImage] = useAppSettingsStore((state) => [state.loadPostImages])

  const imageThumb = loadImage ? (
    <Image {...props} />
  ) : (
    <Icon name="Image" size={72} color="$fadedText" />
  )

  const image = (
    <Image
      source={props.source}
      contentFit="contain"
      style={{
        flex: 1
      }}
      cachePolicy="disk"
    />
  )

  const sourceAsString =
    typeof props.source === 'string'
      ? props.source
      : Array.isArray(props.source)
      ? typeof props.source[0] === 'string'
        ? props.source[0]
        : props.source[0].uri
      : typeof props.source === 'object'
      ? props.source.uri
      : ''

  return (
    <MediaLightbox
      content={image}
      thumbnail={imageThumb}
      contentUrl={sourceAsString}
    />
  )
}
