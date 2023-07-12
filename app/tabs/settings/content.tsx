import { Stack } from 'expo-router'
import AppSetting from '../../../src/components/AppSetting'
import { BodyText, HeadingText } from '../../../src/components/Core/Text'
import { View } from '../../../src/components/Core/View'
import { useAppSettingsStore } from '../../../src/stores/appSettingsStore'

export default function ContentSettings() {
  const [allowNsfw] = useAppSettingsStore((state) => [state.allowNsfw])
  return (
    <View gap="$0.5" padding="$0.5">
      <Stack.Screen options={{ title: 'Content' }} />

      <HeadingText marginTop="$1">Adult content</HeadingText>
      <BodyText bold marginTop="$1">
        Your Lemmy instance/account may also restrict this content.
      </BodyText>
      <AppSetting
        label="Show NSFW content"
        setting="allowNsfw"
        icon="FileWarning"
      />
      {allowNsfw && (
        <AppSetting
          label="Blur NSFW images"
          setting="blurNsfw"
          icon="Sparkles"
        />
      )}

      <HeadingText marginTop="$1">Content loading</HeadingText>
      <BodyText bold marginTop="$1">
        Disabling these will reduce data usage.
      </BodyText>
      <AppSetting
        label="Load feed post images"
        setting="loadPostImages"
        icon="LayoutList"
      />
      <AppSetting
        label="Show comment images inline"
        setting="inlineCommentImages"
        icon="ImageOff"
      />
      <AppSetting
        label="Show user avatars"
        setting="showUserAvatars"
        icon="UserSquare"
      />
    </View>
  )
}
