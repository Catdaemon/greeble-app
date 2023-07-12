import { TouchableOpacity } from 'react-native-gesture-handler'
import Icon from '../Icon'

export default function MoreButton({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <Icon name="MoreHorizontal" />
    </TouchableOpacity>
  )
}
