import { Stack } from 'expo-router'
import { View } from '../../../src/components/Core/View'

export default function Messages() {
  return (
    <View>
      <Stack.Screen options={{ title: 'Messages' }} />
    </View>
  )
}
