import { Input, InputProps } from 'tamagui'
import { View } from '../Core/View'
import { BodyText } from '../Core/Text'

export interface TextInputProps extends InputProps {
  label?: string
}

export default function TextInput({ label, ...props }: TextInputProps) {
  return (
    <View>
      {label && <BodyText bold>{label}</BodyText>}
      <Input
        padding="$0.5"
        height="auto"
        color="$textColor"
        backgroundColor="$contentBackground"
        keyboardType="url"
        fontFamily="$body"
        {...props}
      />
    </View>
  )
}
