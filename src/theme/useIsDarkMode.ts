import { useEffect, useState } from 'react'
import { AppState, Appearance, ColorSchemeName } from 'react-native'
import { shallow } from 'zustand/shallow'
import { useAppSettingsStore } from '../stores/appSettingsStore'

export default function useIsDarkMode() {
  const [autoDarkMode, forceDarkMode] = useAppSettingsStore(
    (state) => [state.darkModeAuto, state.darkMode],
    shallow
  )

  const [currentTheme, setTheme] = useState<ColorSchemeName>(
    Appearance.getColorScheme()
  )

  useEffect(() => {
    AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        const theme = Appearance.getColorScheme()
        setTheme(theme)
      }
    })
  }, [])

  const useDarkMode =
    (autoDarkMode && currentTheme !== 'light') ||
    (!autoDarkMode && forceDarkMode)

  return useDarkMode
}
