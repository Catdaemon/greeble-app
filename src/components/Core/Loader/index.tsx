import { ActivityIndicator } from 'react-native'
import { View, ViewProps } from '../View'

export default function Loader({
  micro,
  ...props
}: ViewProps & { micro?: boolean }) {
  return (
    <View {...props}>
      <ActivityIndicator
        size={micro ? 'small' : 'large'}
        style={{
          width: micro ? 24 : 32,
          height: micro ? 24 : 32
        }}
      />
    </View>
  )
}
