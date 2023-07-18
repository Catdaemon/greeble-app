import { formatDistanceStrict } from 'date-fns'
import { ReactNode } from 'react'
import { Pressable } from 'react-native'
import { BodyText } from '../Core/Text'
import { View } from '../Core/View'
import Icon from '../Icon'
import MarkdownView from '../MarkdownView'
import TextWithIcon from '../TextWithIcon'

export interface MessageProps {
  id: string
  onActionPerformed?: () => void
  author: ReactNode
  body: string
  date: string
  isMod?: boolean
  isAdmin?: boolean
  onReplyPressed?: () => void
}

export default function Message({
  id,
  onActionPerformed,
  author,
  body,
  isMod,
  isAdmin,
  date,
  onReplyPressed
}: MessageProps) {
  const header = (
    <View flex row spread gap="$0.5">
      <View flex row gap="$0.25">
        {author}
        {isMod && (
          <BodyText bold color="$moderatorColor">
            [Moderator]
          </BodyText>
        )}
        {isAdmin && (
          <BodyText bold color="$adminColor">
            [Admin]
          </BodyText>
        )}
      </View>
      <TextWithIcon
        icon="Clock"
        text={formatDistanceStrict(new Date(date), new Date(), {
          addSuffix: false
        })}
      />
    </View>
  )

  return (
    <View
      marginBottom="$0.5"
      padding="$0.5"
      backgroundColor="$contentBackground"
    >
      {header}
      <View>
        <MarkdownView content={body} />
        <View alignItems="flex-end">
          {onReplyPressed && (
            <Pressable onPress={onReplyPressed}>
              <Icon name="Reply" />
            </Pressable>
          )}
        </View>
      </View>
    </View>
  )
}
