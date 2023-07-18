import { Stack } from 'expo-router'

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        fullScreenGestureEnabled: true
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Messages'
        }}
      />
    </Stack>
  )
}
