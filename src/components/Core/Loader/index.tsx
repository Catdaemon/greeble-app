import { ActivityIndicator } from 'react-native'
import { View, ViewProps } from '../View'

export default function Loader({
  micro,
  ...props
}: ViewProps & { micro?: boolean }) {
  return (
    <View {...props}>
      <ActivityIndicator size={micro ? 'small' : 'large'} />
    </View>
  )
}
