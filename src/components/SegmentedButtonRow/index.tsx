import { XGroup } from 'tamagui'
import Button from '../Core/Button'
import { useEffect, useState } from 'react'

export interface SegmentedButtonOption<OptionIdType> {
  id: OptionIdType
  label: string
}

export interface SegmentedButtonRowProps<OptionIdType> {
  options: SegmentedButtonOption<OptionIdType>[]
  selectedId?: OptionIdType
  onSelectedChanged?: (id: OptionIdType) => void
}

export default function SegmentedButtonRow<OptionIdType>({
  options,
  selectedId,
  onSelectedChanged
}: SegmentedButtonRowProps<OptionIdType>) {
  const [selected, setSelected] = useState(selectedId)

  useEffect(() => {
    setSelected(selectedId)
  }, [selectedId])

  return (
    <XGroup marginVertical="$1" marginHorizontal="$0.5">
      {options.map((option) => (
        <Button
          key={option.id as any}
          variant={selected === option.id ? 'primary' : 'outline'}
          flex={1}
          label={option.label}
          onPress={() => {
            setSelected(option.id)
            onSelectedChanged?.(option.id as any)
          }}
        />
      ))}
    </XGroup>
  )
}
