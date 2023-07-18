import { useEffect, useRef, useState } from 'react'
import { Keyboard, Pressable } from 'react-native'
import { View } from '../Core/View'
import Icon from '../Icon'
import TextInput from '../TextInput'

type FormattingType =
  | 'heading'
  | 'bold'
  | 'italic'
  | 'underline'
  | 'strikethrough'
  | 'link'
  | 'image'

export interface MarkdownInputProps {
  value: string
  onChangeText: (value: string) => void
}

export default function MarkdownInput({
  value,
  onChangeText
}: MarkdownInputProps) {
  const [keyboardActive, setKeyboardActive] = useState(false)
  const textSelection = useRef({ start: 0, end: 0 })

  useEffect(() => {
    const showListener = Keyboard.addListener('keyboardWillShow', () => {
      setKeyboardActive(true)
    })
    const hideListener = Keyboard.addListener('keyboardWillHide', () => {
      setKeyboardActive(false)
    })
    return () => {
      showListener.remove()
      hideListener.remove()
    }
  }, [])

  const applyFormatting = (type: FormattingType) => {
    const { start, end } = textSelection.current
    const selectedText = value.substring(start, end)
    const formattedText =
      type === 'heading'
        ? `# ${selectedText}`
        : type === 'bold'
        ? `**${selectedText}**`
        : type === 'italic'
        ? `*${selectedText}*`
        : type === 'underline'
        ? `__${selectedText}__`
        : type === 'strikethrough'
        ? `~~${selectedText}~~`
        : type === 'link'
        ? `[${selectedText}](url)`
        : type === 'image'
        ? `![${selectedText}](url)`
        : selectedText

    onChangeText(
      value.substring(0, start) + formattedText + value.substring(end)
    )
  }

  return (
    <>
      <TextInput
        placeholder="Compose your message here..."
        style={{
          height: '100%',
          paddingBottom: keyboardActive ? 64 : 0
        }}
        multiline
        value={value}
        keyboardType="default"
        onChangeText={onChangeText}
        onSelectionChange={(e) =>
          (textSelection.current = e.nativeEvent.selection)
        }
      />
      {keyboardActive && (
        <View
          style={{
            height: 32,
            backgroundColor: 'grey',
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            flexDirection: 'row',
            gap: 8,
            paddingHorizontal: 8,
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Pressable onPress={() => applyFormatting('heading')}>
            <Icon name="Heading" />
          </Pressable>
          <Pressable onPress={() => applyFormatting('bold')}>
            <Icon name="Bold" />
          </Pressable>
          <Pressable onPress={() => applyFormatting('italic')}>
            <Icon name="Italic" />
          </Pressable>
          <Pressable onPress={() => applyFormatting('underline')}>
            <Icon name="Underline" />
          </Pressable>
          <Pressable onPress={() => applyFormatting('strikethrough')}>
            <Icon name="Strikethrough" />
          </Pressable>
          <Pressable onPress={() => applyFormatting('link')}>
            <Icon name="Link" />
          </Pressable>
          <Pressable onPress={() => applyFormatting('image')}>
            <Icon name="ImagePlus" />
          </Pressable>
        </View>
      )}
    </>
  )
}
