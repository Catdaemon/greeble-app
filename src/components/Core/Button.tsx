import { Button as BaseButton, ButtonProps as BaseButtonProps } from 'tamagui'
import { BodyText } from './Text'
import Loader from './Loader'
import { useState } from 'react'

type ButtonSize = 'small' | 'medium' | 'large'
type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline'

export interface ButtonProps extends BaseButtonProps {
  variant?: ButtonVariant
  size?: ButtonSize
  label?: string
  loading?: boolean
}

const sizePadding: Record<ButtonSize, string> = {
  small: '$0.25',
  medium: '$0.5',
  large: '$1'
}
const sizeTextSize: Record<ButtonSize, number> = {
  small: 12,
  medium: 16,
  large: 18
}

const variantColors: Record<ButtonVariant, string> = {
  primary: '$primary',
  secondary: '$secondary',
  ghost: 'transparent',
  outline: 'transparent'
}
const variantTextColors: Record<ButtonVariant, string> = {
  primary: 'white',
  secondary: 'white',
  ghost: '$textColor',
  outline: '$textColor'
}

export default function Button({
  variant,
  size,
  label,
  children,
  loading,
  ...props
}: ButtonProps) {
  const sizeVal = size ? sizePadding[size] : sizePadding.medium
  const textSizeVal = size ? sizeTextSize[size] : sizeTextSize.medium
  const bgColVal = variant ? variantColors[variant] : variantColors.primary

  const [initialSize, setInitialSize] = useState({
    width: 0,
    height: 0,
    x: 0,
    y: 0
  })

  return (
    <BaseButton
      {...props}
      borderWidth={variant === 'outline' ? 1 : 0}
      borderColor="$primary"
      padding={sizeVal}
      height={initialSize.height === 0 ? 'auto' : initialSize.height}
      width={initialSize.width === 0 ? undefined : initialSize.width}
      backgroundColor={bgColVal}
      disabled={loading}
      onLayout={(ev) => {
        if (initialSize.width === 0 && initialSize.height === 0) {
          setInitialSize(ev.nativeEvent.layout)
        }
      }}
    >
      {loading ? (
        <Loader micro />
      ) : (
        label && (
          <BodyText color={variantTextColors[variant]} fontSize={textSizeVal}>
            {label}
          </BodyText>
        )
      )}
      {children}
    </BaseButton>
  )
}
