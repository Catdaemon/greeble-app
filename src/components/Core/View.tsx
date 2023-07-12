import { FlexAlignType } from 'react-native'
import { View as BaseView, StackProps } from 'tamagui'

export default function CenteredView(props: ViewProps) {
  return <View center row {...props} />
}

export interface ViewProps extends Omit<StackProps, 'flex'> {
  centerH?: boolean
  centerV?: boolean
  center?: boolean
  row?: boolean
  flex?: boolean | number
  spread?: boolean
}

export function View({
  centerH,
  centerV,
  center,
  row,
  flex,
  spread,
  ...props
}: ViewProps) {
  const flexVal = flex === true ? 1 : flex === false ? undefined : flex

  // center props need to flip when row is true
  let alignVal: FlexAlignType = undefined
  let justifyVal:
    | 'center'
    | 'flex-start'
    | 'flex-end'
    | 'space-between'
    | 'space-around'
    | 'space-evenly' = undefined

  if (center) {
    justifyVal = 'center'
    alignVal = 'center'
  }

  if (row) {
    if (centerV) {
      alignVal = 'center'
    }
    if (centerH) {
      justifyVal = 'center'
    }
  } else {
    if (center) {
      justifyVal = 'center'
      alignVal = 'center'
    }
    if (centerV) {
      justifyVal = 'center'
    }
    if (centerH) {
      alignVal = 'center'
    }
  }
  if (spread) {
    justifyVal = 'space-between'
  }

  return (
    <BaseView
      justifyContent={justifyVal}
      alignItems={alignVal}
      flexDirection={row ? 'row' : undefined}
      flex={flexVal}
      {...props}
    />
  )
}
