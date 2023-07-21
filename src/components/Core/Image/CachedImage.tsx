import { Image, ImageProps, ImageSource } from 'expo-image'
import useFileDownload from '../../../hooks/useFileDownload'
import { View } from '../View'
import Loader from '../Loader'

export default function CachedImage(props: ImageProps) {
  const src = props.source as ImageSource
  const fileDownload = useFileDownload(src.uri, {
    'User-Agent': 'greeble/1',
    ...src.headers
  })

  const image = (
    <Image
      {...props}
      source={{
        uri: fileDownload.filePath
      }}
    />
  )

  const withWrapper = (
    <View style={props.style}>
      {fileDownload.isDownloading ? (
        <View
          position="absolute"
          top={0}
          left={0}
          aspectRatio={1}
          style={props.style}
          center
        >
          <Loader style={props.style} />
        </View>
      ) : (
        image
      )}
    </View>
  )

  return withWrapper
}
