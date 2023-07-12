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

  return <MediaLightbox content={image} thumbnail={imageThumb} />
}
