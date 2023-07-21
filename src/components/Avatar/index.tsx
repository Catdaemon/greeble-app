import { ImageStyle } from 'expo-image'
import Image from '../Core/Image'
import { View } from '../Core/View'
import Icon, { IconName } from '../Icon'

export interface AvatarProps {
  size?: number
  src?: string
  placeholderIcon: IconName
  style?: ImageStyle
  pressable?: boolean
}

export default function Avatar({
  size,
  src,
  placeholderIcon,
  style,
  pressable = true
}: AvatarProps) {
  return src ? (
    <Image
      enableLightbox={pressable}
      src={src}
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        ...style
      }}
      contentFit="cover"
    />
  ) : (
    <View style={style}>
      <Icon name={placeholderIcon} size={size} color="$fadedText" />
    </View>
  )
}
