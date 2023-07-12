import { Stack } from 'expo-router'
import AppSetting from '../../../src/components/AppSetting'
import { HeadingText } from '../../../src/components/Core/Text'
import { View } from '../../../src/components/Core/View'
import { useAppSettingsStore } from '../../../src/stores/appSettingsStore'
import { ScrollView } from 'tamagui'

export default function AppearanceSettings() {
  const [autoDarkMode, postListCardView] = useAppSettingsStore((state) => [
    state.darkModeAuto,
    state.postListCardView
  ])
  return (
    <ScrollView>
      <View gap="$0.5" padding="$0.5">
        <Stack.Screen options={{ title: 'Appearance' }} />

        <HeadingText marginVertical="$1">Theme</HeadingText>
        <AppSetting
          label="Automatic dark mode"
          setting="darkModeAuto"
          icon="MoonStar"
        />
        {!autoDarkMode && (
          <AppSetting label="Dark mode" setting="darkMode" icon="Moon" />
        )}

        <HeadingText marginVertical="$1">Layout</HeadingText>
        <AppSetting
          label="Show post titles at the top of cards"
          setting="postTitleAtTop"
          icon="ArrowUp"
        />
        <AppSetting
          label="Use card view in posts list"
          setting="postListCardView"
          icon="WalletCards"
        />
        {!postListCardView && (
          <AppSetting
            label="Post thumbnail on right"
            setting="postThumbnailRight"
            icon="MoveRight"
          />
        )}

        <HeadingText marginVertical="$1">Information density</HeadingText>

        <AppSetting
          label="Show server for local users"
          setting="showLocalUserServer"
          icon="Users"
        />
        <AppSetting
          label="Show server for federated users"
          setting="showFederatedUserServer"
          icon="Users"
        />
        <AppSetting
          label="Show server for local posts"
          setting="showLocalCommunityServer"
          icon="Layers"
        />
        <AppSetting
          label="Show server for federated posts"
          setting="showFederatedCommunityServer"
          icon="Layers"
        />
        <AppSetting
          label="Show post authors on feed"
          setting="postAuthorInFeed"
          icon="Pencil"
        />
        <AppSetting
          label="Show post link URLs on feed"
          setting="showPostUrl"
          icon="Globe"
        />
      </View>
    </ScrollView>
  )
}
