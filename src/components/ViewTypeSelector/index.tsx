import { TouchableOpacity } from 'react-native'
import { useTemporaryStore } from '../../../src/stores/temporaryStore'
import Icon, { IconName } from '../Icon'
import useActionSheet from '../../hooks/useActionSheet'

const nameMapping: Record<Lemmy.Enums.ListingType, string> = {
  All: 'All servers',
  Subscribed: 'Subscribed',
  Local: 'Local'
}

interface ViewType {
  type: Lemmy.Enums.ListingType
  label: string
  icon: IconName
}

const ViewTypes: ViewType[] = [
  { type: 'All', label: 'Whole fediverse', icon: 'Globe2' },
  {
    type: 'Subscribed',
    label: 'Subscribed communities',
    icon: 'MailCheck'
  },
  {
    type: 'Local',
    label: 'Communities on this server',
    icon: 'MapPin'
  }
]

function getIcon(type: Lemmy.Enums.ListingType) {
  const name = ViewTypes.filter((x) => x.type === type)[0].icon
  return <Icon name={name} />
}

export default function ViewTypeSelector() {
  const [viewType, setViewType] = useTemporaryStore((store) => [
    store.viewType,
    store.setViewType
  ])

  const showActionSheet = useActionSheet('View items from', [
    ...ViewTypes.map((x) => ({
      title: x.label,
      action: () => setViewType(x.type)
    }))
  ])

  return (
    <>
      <TouchableOpacity onPress={showActionSheet}>
        {getIcon(viewType)}
      </TouchableOpacity>
    </>
  )
}
