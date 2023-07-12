import Loader from '.'
import { View } from '../View'

export default function FullScreenLoader() {
  return (
    <View flex center>
      <Loader />
    </View>
  )
}
