import { useColorScheme } from 'react-native'
import { useAppSettingsStore } from '../stores/appSettingsStore'
import { shallow } from 'zustand/shallow'

export default function useIsDarkMode() {
  const colorScheme = useColorScheme()
  const [autoDarkMode, forceDarkMode] = useAppSettingsStore(
    (state) => [state.darkModeAuto, state.darkMode],
    shallow
  )

  const useDarkMode =
    (autoDarkMode && colorScheme !== 'light') ||
    (!autoDarkMode && forceDarkMode)

  return useDarkMode
}
