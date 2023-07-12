import * as LucideIcons from 'lucide-react-native'
import {
  ColorTokens,
  SizeTokens,
  Tokens,
  getToken,
  getTokenValue,
  useTheme
} from 'tamagui'

type KeysMatching<T, V> = {
  [K in keyof T]: T[K] extends V ? K : never
}[keyof T]

export type IconName = KeysMatching<typeof LucideIcons, LucideIcons.LucideIcon>

export interface IconProps {
  name: IconName
  size?: SizeTokens
  color?: ColorTokens | string
  fillColor?: ColorTokens | string
}

export default function Icon({
  name,
  color,
  fillColor,
  size = '$1.5'
}: IconProps) {
  const theme = useTheme()

  const tokenSize = Number.isInteger(size)
    ? size
    : getTokenValue(size as any, 'size')
  const noDollaColor = color?.replace('$', '')
  const themeColor = !color
    ? theme.primaryColor.get()
    : theme[noDollaColor]?.get() ?? color

  const noDollaFillColor = fillColor?.replace('$', '')
  const themeFillColor = !fillColor
    ? 'transparent'
    : theme[noDollaFillColor]?.get() ?? noDollaFillColor

  const IconComponent = LucideIcons[name]
  return (
    <IconComponent size={tokenSize} color={themeColor} fill={themeFillColor} />
  )
}
