import { useSafeAreaInsets } from 'react-native-safe-area-context'
import MediaLightbox from '..'
import { useAppSettingsStore } from '../../../stores/appSettingsStore'
import { View } from '../../Core/View'
import Icon from '../../Icon'
import { ImageProps } from '../../Core/Image'
import CachedImage from '../../Core/Image/CachedImage'

export default function ImageLightbox(props: ImageProps) {
  const [loadImage] = useAppSettingsStore((state) => [state.loadPostImages])
  const safeArea = useSafeAreaInsets()

  const isGif = props.src?.endsWith('.gif')

  const imageThumb = isGif ? (
    <Icon name="Video" size={72} color="$fadedText" />
  ) : loadImage ? (
    <CachedImage
      {...props}
      source={{
        uri: props.src
      }}
    />
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
      <CachedImage
        source={{
          uri: props.src
        }}
        contentFit="contain"
        style={{
          width: '100%',
          height: '100%'
        }}
      />
    </View>
  )

  return (
    <MediaLightbox
      content={image}
      thumbnail={imageThumb}
      contentUrl={props.src}
    />
  )
}
