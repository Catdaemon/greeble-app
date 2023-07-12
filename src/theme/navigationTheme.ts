import { DarkTheme, DefaultTheme, Theme } from '@react-navigation/native'
import useIsDarkMode from './useIsDarkMode'
import { useTheme } from 'tamagui'

type UseThemeResult = ReturnType<typeof useTheme>

function getNavigationTheme(light: boolean, theme: UseThemeResult) {
  const baseTheme = light ? DefaultTheme : DarkTheme
  const customTheme: Theme = {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      primary: theme.primaryColor.get(),
      text: theme.textColor.get(),
      background: theme.background.get(),
      border: theme.fadedText.get(),
      card: theme.contentBackground.get()
    },
    dark: !light
  }

  return customTheme
}

export default function useNavigationTheme() {
  const theme = useTheme()
  const isDarkMode = useIsDarkMode()
  return getNavigationTheme(!isDarkMode, theme)
}
