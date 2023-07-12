import { Stack, useRouter } from 'expo-router'
import { TouchableOpacity } from 'react-native-gesture-handler'
import CardRow from '../../../src/components/CardRow'
import { BodyText } from '../../../src/components/Core/Text'
import { View } from '../../../src/components/Core/View'
import Icon from '../../../src/components/Icon'

export default function Settings() {
  const router = useRouter()
  return (
    <View flex gap="$0.5" padding="$0.5">
      <Stack.Screen options={{ title: 'Settings' }} />

      <TouchableOpacity onPress={() => router.push('/tabs/settings/content')}>
        <CardRow
          left={<Icon name="Newspaper" />}
          center={<BodyText>Content</BodyText>}
          right={<Icon name="ChevronRight" />}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => router.push('/tabs/settings/appearance')}
      >
        <CardRow
          left={<Icon name="Paintbrush" />}
          center={<BodyText>Appearance</BodyText>}
          right={<Icon name="ChevronRight" />}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/tabs/settings/interface')}>
        <CardRow
          left={<Icon name="PanelTop" />}
          center={<BodyText>Interface</BodyText>}
          right={<Icon name="ChevronRight" />}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/tabs/settings/data')}>
        <CardRow
          left={<Icon name="Database" />}
          center={<BodyText>Data</BodyText>}
          right={<Icon name="ChevronRight" />}
        />
      </TouchableOpacity>
    </View>
  )
}
