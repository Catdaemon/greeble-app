import { Stack } from 'expo-router'

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: true
        }}
      />
      <Stack.Screen
        name="add"
        options={{
          presentation: 'modal'
        }}
      />
    </Stack>
  )
}
