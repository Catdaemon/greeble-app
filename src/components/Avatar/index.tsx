import { StyleProp, ViewStyle } from 'react-native'
import Icon, { IconName } from '../Icon'
import Image from '../Core/Image'
import { ImageStyle } from 'expo-image'
import { View } from '../Core/View'

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
      source={{
        uri: src
      }}
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
