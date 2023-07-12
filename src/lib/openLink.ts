import { Linking } from 'react-native'
import { useAppSettingsStore } from '../stores/appSettingsStore'
import * as WebBrowser from 'expo-web-browser'
import handleLocalLink from './lemmy/util/handleLocalLink'

export default function openLink(url: string) {
  const isLocal = handleLocalLink(url)

  if (isLocal) {
    return
  }

  const openInApp = useAppSettingsStore.getState().openLinksInApp

  console.log('opening', url)

  if (openInApp) {
    WebBrowser.openBrowserAsync(url).catch(() => {
      Linking.openURL(url)
    })
    return
  }

  Linking.openURL(url)
}
