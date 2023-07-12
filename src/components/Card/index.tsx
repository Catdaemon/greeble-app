import {
  Card as BaseCard,
  CardProps as BaseCardProps,
  getTokens,
  useTheme
} from 'tamagui'

interface CardProps extends Omit<BaseCardProps, 'flex'> {
  centerH?: boolean
  centerV?: boolean
  center?: boolean
  row?: boolean
  spread?: boolean
  flex?: boolean | number
}

export default function Card({
  centerH,
  centerV,
  center,
  row,
  flex,
  spread,
  ...props
}: CardProps) {
  const flexVal = flex === true ? 1 : flex === false ? undefined : flex
  const justifyVal = spread
    ? 'space-between'
    : center || centerH
    ? 'center'
    : 'flex-start'

  return (
    <BaseCard
      padding="$0.5"
      justifyContent={justifyVal}
      alignItems={center || centerV ? 'center' : 'stretch'}
      flexGrow={1}
      flexDirection={row ? 'row' : 'column'}
      flex={flexVal}
      {...props}
    />
  )
}
