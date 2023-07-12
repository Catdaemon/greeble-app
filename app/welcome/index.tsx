import { Stack, useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import AppSetting from '../../src/components/AppSetting'
import Button from '../../src/components/Core/Button'
import { BodyText, HeadingText } from '../../src/components/Core/Text'
import { View } from '../../src/components/Core/View'
import { useAccountStore } from '../../src/stores/accountStore'
import { useAppSettingsStore } from '../../src/stores/appSettingsStore'
import AddAccount from '../tabs/account/add'

function SplashScreen({ onNext }: { onNext: () => void }) {
  return (
    <View centerV flex>
      <Stack.Screen
        options={{
          headerShown: false
        }}
      />
      <View padding="$1" gap="$2">
        <View gap="$0.5">
          <HeadingText center>Hi there!</HeadingText>
          <HeadingText center>Welcome to the Fediverse</HeadingText>
          <HeadingText center>... and welcome to Greeble!</HeadingText>
        </View>
        <Button
          variant="secondary"
          onPress={() =>
            alert(
              `We simply don't know, but your cat does. Greebles are the invisible entities or creatures that animals chase and stare at all day.`
            )
          }
        >
          What is a Greeble?
        </Button>
        <Button
          variant="secondary"
          onPress={() =>
            alert(`Lemmy is a link aggregator, like Reddit, which is designed in a more
        open and distributed way. There is no one company in control, so you can
        join any server/website you like, and see posts and comments from all
        the other servers.`)
          }
        >
          What is Lemmy?
        </Button>
        <Button onPress={onNext}>Next</Button>
      </View>
    </View>
  )
}
function AccountSetup({ onNext }: { onNext: () => void }) {
  const [accounts] = useAccountStore((state) => [state.accounts])
  useEffect(() => {
    if (accounts.length > 0) {
      onNext()
    }
  }, [accounts])
  return <AddAccount />
}

function SettingsStep({ onNext }: { onNext: () => void }) {
  const [allowNsfw] = useAppSettingsStore((state) => [state.allowNsfw])
  return (
    <View gap="$1" padding="$1">
      <HeadingText>Settings</HeadingText>
      <BodyText>
        Set up how you'd like Greeble to work. More settings are available on
        the settings screen.
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
      <AppSetting
        label="Show server for local users"
        setting="showLocalUserServer"
        icon="Users"
      />
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
      <Button onPress={onNext}>Get started</Button>
    </View>
  )
}

export default function Welcome() {
  const router = useRouter()
  const [activeIndex, setActiveIndex] = useState(0)

  const renderActiveStep = () => {
    switch (activeIndex) {
      case 0:
        return <SplashScreen onNext={() => setActiveIndex(1)} />
      case 1:
        return <AccountSetup onNext={() => setActiveIndex(2)} />
      case 2:
        return <SettingsStep onNext={() => router.replace('/feed/')} />
    }
  }

  return <SafeAreaView style={{ flex: 1 }}>{renderActiveStep()}</SafeAreaView>
}
