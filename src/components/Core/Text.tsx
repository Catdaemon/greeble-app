import { Text, TextProps } from 'tamagui'

export function LinkText({ ...props }: BodyTextProps) {
  return <BodyText {...props} underline color="$linkColor" />
}

interface BodyTextProps extends BaseTextProps {
  bold?: boolean
  tiny?: boolean
  italic?: boolean
  strike?: boolean
  underline?: boolean
}

export function BodyText({
  bold,
  tiny,
  strike,
  italic,
  underline,
  ...props
}: BodyTextProps) {
  return (
    <BaseText
      color="$textColor"
      // fontFamily="$body"
      fontStyle={italic ? 'italic' : 'normal'}
      textDecorationLine={
        underline && strike
          ? 'underline line-through'
          : strike
          ? 'line-through'
          : underline
          ? 'underline'
          : undefined
      }
      fontSize={tiny ? 12 : 16}
      fontWeight={bold ? '500' : '400'}
      {...props}
    />
  )
}

export function HeadingText(props: BaseTextProps) {
  return (
    <BaseText
      {...props}
      color="$textColor"
      // fontFamily="$heading"
      fontWeight={'500'}
      fontSize={18}
    />
  )
}

export function TitleText(props: BaseTextProps) {
  return (
    <BaseText
      {...props}
      color="$textColor"
      // fontFamily="$heading"
      fontWeight={'500'}
      fontSize={16}
    />
  )
}

interface BaseTextProps extends Omit<TextProps, 'flex'> {
  flex?: boolean | number
  center?: boolean
}

function BaseText({ flex, center, ...props }: BaseTextProps) {
  const flexVal = flex === true ? 1 : flex === false ? undefined : flex
  return (
    <Text flex={flexVal} textAlign={center ? 'center' : 'auto'} {...props} />
  )
}
