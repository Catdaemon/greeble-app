import { useSafeAreaInsets } from 'react-native-safe-area-context'
import MediaLightbox from '..'
import { useAppSettingsStore } from '../../../stores/appSettingsStore'
import { View } from '../../Core/View'
import Icon from '../../Icon'
import Image, { ImageProps } from '../../Core/Image'

export default function ImageLightbox(props: ImageProps) {
  const [loadImage] = useAppSettingsStore((state) => [state.loadPostImages])
  const safeArea = useSafeAreaInsets()

  const isGif = props.src?.endsWith('.gif')

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
        src={props.src}
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
