import { ReactNode } from 'react'
import Icon, { IconName } from '../Icon'
import { ColorTokens } from 'tamagui'
import { View } from '../Core/View'

export default function IconOverlay({
  icon,
  children,
  iconColor
}: {
  icon: IconName
  children: ReactNode
  iconColor: ColorTokens | string
}) {
  return (
    <View>
      {children}
      <View
        style={{
          position: 'absolute',
          bottom: 2,
          right: 2,
          pointerEvents: 'none'
        }}
      >
        <Icon name={icon} size="$2" color={iconColor} fillColor="white" />
      </View>
    </View>
  )
}
