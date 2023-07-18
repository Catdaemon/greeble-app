import { ActionSheetProvider } from '@expo/react-native-action-sheet'
import { ThemeProvider as NavigationThemeProvider } from '@react-navigation/native'
import { QueryClientProvider } from '@tanstack/react-query'
import { useFonts } from 'expo-font'
import { Slot, SplashScreen, Stack, Tabs, useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { Platform, StatusBar, UIManager } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { TamaguiProvider, Theme } from 'tamagui'
import queryClient from '../src/lib/lemmy/rqClient'
import useNavigationTheme from '../src/theme/navigationTheme'
import useIsDarkMode from '../src/theme/useIsDarkMode'
import tamaGuiConfig from '../tamagui.config'
import { useAccountStore } from '../src/stores/accountStore'
import { shallow } from 'zustand/shallow'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

SplashScreen.preventAutoHideAsync()

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true)
  }
}

function NavThemeProvider({ children }) {
  const navTheme = useNavigationTheme()

  return (
    <NavigationThemeProvider value={navTheme}>
      {children}
    </NavigationThemeProvider>
  )
}

export default function RootLayout() {
  const router = useRouter()
  const isDarkMode = useIsDarkMode()
  const [isReady, setIsReady] = useState(false)

  const [fontsLoaded] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf')
  })

  useEffect(() => {
    if (!fontsLoaded) {
      return
    }

    setIsReady(true)
    SplashScreen.hideAsync()
  }, [fontsLoaded])

  const [accounts] = useAccountStore((state) => [state.accounts], shallow)

  useEffect(() => {
    if (!isReady) {
      return
    }

    if (accounts?.length > 0) {
      router.replace('/tabs/feed/')
    } else {
      router.replace('/welcome/')
    }
  }, [accounts, router, isReady])

  if (!isReady) {
    return <Slot />
  }

  return (
    <GestureHandlerRootView
      style={{
        flex: 1
      }}
    >
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <ActionSheetProvider>
            <TamaguiProvider config={tamaGuiConfig}>
              <Theme name={isDarkMode ? 'dark' : 'light'}>
                <NavThemeProvider>
                  <StatusBar
                    barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                  />
                  <Stack>
                    <Stack.Screen name="welcome" />
                    <Stack.Screen
                      name="tabs"
                      options={{
                        headerShown: false
                      }}
                    />
                    <Stack.Screen
                      name="user/[user]"
                      options={{
                        presentation: 'modal',
                        title: 'User',
                        headerShown: true
                      }}
                    />
                    <Stack.Screen
                      name="message/compose"
                      options={{
                        presentation: 'modal',
                        title: 'Compose message',
                        headerShown: true
                      }}
                    />
                    <Stack.Screen
                      name="comments/[postId]"
                      options={{
                        title: 'Post Comments'
                      }}
                    />
                    <Stack.Screen
                      name="community/[community]"
                      options={{
                        title: 'Community'
                      }}
                    />
                  </Stack>
                </NavThemeProvider>
              </Theme>
            </TamaguiProvider>
          </ActionSheetProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}
