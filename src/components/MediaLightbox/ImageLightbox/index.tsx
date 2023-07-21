import { Image, ImageProps } from 'expo-image'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import MediaLightbox from '..'
import { useAppSettingsStore } from '../../../stores/appSettingsStore'
import { View } from '../../Core/View'
import Icon from '../../Icon'

export default function ImageLightbox(props: ImageProps) {
  const [loadImage] = useAppSettingsStore((state) => [state.loadPostImages])
  const safeArea = useSafeAreaInsets()

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

  const isGif = sourceAsString?.endsWith('.gif')

  const imageThumb = isGif ? (
    <Icon name="Video" size={72} color="$fadedText" />
  ) : loadImage ? (
    <Image {...props} />
  ) : (
    <Icon name="Image" size={72} color="$fadedText" />
  )

  const image = (
    <View
      flex
      paddingTop={safeArea.top}
      paddingBottom={safeArea.bottom}
      paddingLeft={safeArea.left}
      paddingRight={safeArea.right}
    >
      <Image
        source={props.source}
        contentFit="contain"
        style={{
          flex: 1
        }}
        // cachePolicy="disk"
      />
    </View>
  )

  return (
    <MediaLightbox
      content={image}
      thumbnail={imageThumb}
      contentUrl={sourceAsString}
    />
  )
}
