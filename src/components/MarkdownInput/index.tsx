import { useEffect, useRef, useState } from 'react'
import { Keyboard, Modal, Pressable, useWindowDimensions } from 'react-native'
import { View } from '../Core/View'
import Icon from '../Icon'
import TextInput from '../TextInput'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated'

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

const BAR_HEIGHT = 48

export default function MarkdownInput({
  value,
  onChangeText
}: MarkdownInputProps) {
  const keyboardOpacity = useSharedValue(0)
  const keyboardOffset = useSharedValue(0)
  const { height } = useWindowDimensions()
  const textSelection = useRef({ start: 0, end: 0 })

  useEffect(() => {
    const showListener = Keyboard.addListener('keyboardWillShow', (ev) => {
      keyboardOpacity.value = withTiming(1, { duration: 200 })
      keyboardOffset.value = withTiming(ev.endCoordinates.height, {
        duration: 200
      })
    })
    const hideListener = Keyboard.addListener('keyboardWillHide', () => {
      keyboardOpacity.value = withTiming(0, { duration: 200 })
      keyboardOffset.value = withTiming(0, { duration: 200 })
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

  const inputStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: -keyboardOffset.value - BAR_HEIGHT }],

    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0
  }))

  const barStyle = useAnimatedStyle(() => ({
    opacity: keyboardOpacity.value,
    transform: [{ translateY: -keyboardOffset.value }],

    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0
  }))

  return (
    <>
      <Animated.View style={inputStyle}>
        <TextInput
          placeholder="Compose your message here..."
          style={{
            height: 100,
            paddingBottom: 64
          }}
          multiline
          value={value}
          keyboardType="default"
          onChangeText={onChangeText}
          onSelectionChange={(e) =>
            (textSelection.current = e.nativeEvent.selection)
          }
        />
      </Animated.View>

      <Animated.View style={barStyle}>
        <View
          backgroundColor="$contentBackground"
          borderTopColor="$lightText"
          borderTopWidth={1}
          style={{
            height: BAR_HEIGHT,
            flexDirection: 'row',
            gap: 8,
            padding: 8,
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Pressable onPress={() => applyFormatting('heading')}>
            <Icon name="Heading" color="$textColor" />
          </Pressable>
          <Pressable onPress={() => applyFormatting('bold')}>
            <Icon name="Bold" color="$textColor" />
          </Pressable>
          <Pressable onPress={() => applyFormatting('italic')}>
            <Icon name="Italic" color="$textColor" />
          </Pressable>
          <Pressable onPress={() => applyFormatting('underline')}>
            <Icon name="Underline" color="$textColor" />
          </Pressable>
          <Pressable onPress={() => applyFormatting('strikethrough')}>
            <Icon name="Strikethrough" color="$textColor" />
          </Pressable>
          <Pressable onPress={() => applyFormatting('link')}>
            <Icon name="Link" color="$textColor" />
          </Pressable>
          <Pressable onPress={() => applyFormatting('image')}>
            <Icon name="ImagePlus" color="$textColor" />
          </Pressable>
        </View>
      </Animated.View>
    </>
  )
}
