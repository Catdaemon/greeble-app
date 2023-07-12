import { ColorTokens } from 'tamagui'
import { BodyText } from '../Core/Text'
import { View } from '../Core/View'
import Icon, { IconName } from '../Icon'

export default function TextWithIcon({
  icon,
  text,
  iconColor
}: {
  icon: IconName
  text: string
  iconColor?: ColorTokens
}) {
  return (
    <View row centerV gap="$0.25">
      <Icon name={icon} size="$1" color={iconColor ?? '$fadedText'} />
      <BodyText color="$fadedText">{text}</BodyText>
    </View>
  )
}
