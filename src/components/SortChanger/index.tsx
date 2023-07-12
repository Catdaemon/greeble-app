import { TouchableOpacity } from 'react-native'
import Icon, { IconName } from '../Icon'
import useActionSheet from '../../hooks/useActionSheet'

export interface SortChangerProps {
  currentSort: Lemmy.Enums.SortType
  onChange: (sort: Lemmy.Enums.SortType) => void
}

interface SupportedSortType {
  sort: Lemmy.Enums.SortType
  label: string
  icon: IconName
}

const SortTypes: SupportedSortType[] = [
  { sort: 'Active', label: 'Active', icon: 'Activity' },
  { sort: 'Hot', label: 'Hot', icon: 'Flame' },
  { sort: 'New', label: 'New', icon: 'Clock' },
  { sort: 'TopAll', label: 'Top all-time', icon: 'SortDesc' }
]

function getSortIcon(sort: Lemmy.Enums.SortType) {
  const name = SortTypes.filter((x) => x.sort === sort)[0].icon
  return <Icon name={name} />
}

export default function SortChanger({
  currentSort,
  onChange
}: SortChangerProps) {
  const showActionSheet = useActionSheet('Sort by', [
    ...SortTypes.map((x) => ({
      title: x.label,
      action: () => onChange(x.sort)
    }))
  ])

  return (
    <TouchableOpacity onPress={showActionSheet}>
      {getSortIcon(currentSort)}
    </TouchableOpacity>
  )
}
