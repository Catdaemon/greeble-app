import {
  AppSettingsStoreState,
  useAppSettingsStore
} from '../../stores/appSettingsStore'
import { Switch } from 'react-native-gesture-handler'
import CardRow from '../CardRow'
import { BodyText } from '../Core/Text'
import Icon, { IconName } from '../Icon'

export interface AppSettingProps {
  setting: keyof AppSettingsStoreState
  label: string
  icon: IconName
}

export default function AppSetting({ label, setting, icon }: AppSettingProps) {
  const [value, setValue] = useAppSettingsStore((state) => [
    state[setting],
    state.setSettingValue
  ])

  return (
    <CardRow
      left={<Icon name={icon} size={24} />}
      center={<BodyText>{label}</BodyText>}
      right={
        <Switch
          value={value}
          onValueChange={(newVal) => setValue(setting, newVal)}
        />
      }
    />
  )
}
