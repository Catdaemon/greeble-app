import { TouchableOpacity } from 'react-native'
import Icon, { IconName } from '../Icon'
import useActionSheet from '../../hooks/useActionSheet'

export interface SortChangerProps {
  currentSort: Lemmy.Enums.CommentSortType
  onChange: (sort: Lemmy.Enums.CommentSortType) => void
}

interface SupportedSortType {
  sort: Lemmy.Enums.CommentSortType
  icon: IconName
}

const SortTypes: SupportedSortType[] = [
  { sort: 'Hot', icon: 'Flame' },
  { sort: 'New', icon: 'Clock' },
  { sort: 'Top', icon: 'Award' }
]

function getSortIcon(sort: Lemmy.Enums.CommentSortType) {
  const icon = SortTypes.filter((x) => x.sort === sort)[0].icon
  return <Icon name={icon} />
}

export default function CommentSortChanger({
  currentSort,
  onChange
}: SortChangerProps) {
  const showActionSheet = useActionSheet('Sort comments by', [
    ...SortTypes.map((x) => ({
      title: x.sort,
      action: () => onChange(x.sort)
    }))
  ])

  return (
    <TouchableOpacity onPress={showActionSheet}>
      {getSortIcon(currentSort)}
    </TouchableOpacity>
  )
}
