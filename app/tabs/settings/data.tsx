import * as ExpoImage from 'expo-image'
import { Stack } from 'expo-router'
import { Alert } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import CardRow from '../../../src/components/CardRow'
import { BodyText, HeadingText } from '../../../src/components/Core/Text'
import { View } from '../../../src/components/Core/View'
import Icon from '../../../src/components/Icon'
import queryClient from '../../../src/lib/lemmy/rqClient'
import { useAccountStore } from '../../../src/stores/accountStore'
import { useAppSettingsStore } from '../../../src/stores/appSettingsStore'
import { useTemporaryStore } from '../../../src/stores/temporaryStore'

export default function ContentSettings() {
  const [allowNsfw] = useAppSettingsStore((state) => [state.allowNsfw])
  return (
    <View gap="$0.5" padding="$0.5">
      <Stack.Screen options={{ title: 'Data' }} />

      <HeadingText marginVertical="$1">Clear data</HeadingText>
      <TouchableOpacity
        onPress={async () => {
          await ExpoImage.Image.clearDiskCache()
          await ExpoImage.Image.clearMemoryCache()
          Alert.alert('Deleted', 'Cached image data has been deleted.')
        }}
      >
        <CardRow
          left={<Icon name="Trash2" color="$errorBackground" />}
          center={<BodyText>Delete image cache</BodyText>}
          right={<Icon name="ChevronRight" />}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          queryClient.clear()
          Alert.alert('Deleted', 'Cached data has been deleted.')
        }}
      >
        <CardRow
          left={<Icon name="Trash2" color="$errorBackground" />}
          center={<BodyText>Delete post/comment cache</BodyText>}
          right={<Icon name="ChevronRight" />}
        />
      </TouchableOpacity>
      <HeadingText marginTop="$1">Erase everything</HeadingText>
      <TouchableOpacity
        onPress={() => {
          Alert.alert(
            'Are you sure?',
            'This will delete all app data, including your account logins.',
            [
              {
                text: 'Delete',
                style: 'destructive',
                onPress: () => {
                  useTemporaryStore.getState().clear()
                  useAppSettingsStore.getState().clear()
                  useAccountStore.getState().clear()
                  queryClient.clear()
                  Alert.alert('Deleted', 'All app data has been deleted.')
                }
              },
              {
                text: 'Cancel',
                isPreferred: true,
                style: 'cancel',
                onPress: () => {}
              }
            ]
          )
        }}
      >
        <CardRow
          left={<Icon name="Trash2" color="$errorBackground" />}
          center={<BodyText>Clear all app data</BodyText>}
          right={<Icon name="ChevronRight" />}
        />
      </TouchableOpacity>
    </View>
  )
}
