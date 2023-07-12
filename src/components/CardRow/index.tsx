import Card from '../Card'
import { View } from '../Core/View'

export interface CardRowProps {
  left?: React.ReactNode
  center?: React.ReactNode
  right?: React.ReactNode
}

export default function CardRow({ left, center, right }) {
  return (
    <Card row spread centerV padding="$1">
      <View row flex centerV gap="$0.5">
        {left}
        {center}
      </View>
      {right}
    </Card>
  )
}
