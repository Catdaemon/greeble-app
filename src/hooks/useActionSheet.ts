import { useActionSheet as originalUseActionSheet } from '@expo/react-native-action-sheet'

interface ActionSheetOption {
  title: string
  action: () => void
}

export default function useActionSheet(
  message: string,
  options: ActionSheetOption[],
  showCancel: boolean = true
) {
  const { showActionSheetWithOptions } = originalUseActionSheet()

  const showActionSheet = () => {
    const optionTitles = options.map((option) => option.title)
    const cancelButtonIndex = showCancel ? options.length : -1

    showActionSheetWithOptions(
      {
        options: showCancel ? [...optionTitles, 'Cancel'] : optionTitles,
        cancelButtonIndex,
        title: message
      },
      (buttonIndex) => {
        if (buttonIndex === cancelButtonIndex) return

        options[buttonIndex].action()
      }
    )
  }

  return showActionSheet
}
