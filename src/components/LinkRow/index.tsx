import { Pressable } from 'react-native'
import openLink from '../../lib/openLink'
import PostThumbnail from '../PostThumbnail'
import Card from '../Card'
import { useTheme } from 'tamagui'
import { View } from '../Core/View'
import { BodyText } from '../Core/Text'

export interface Link {
  text?: string
  href: string
}

export interface LinkRowProps {
  link: Link
}

export default function LinkRow({ link }: LinkRowProps) {
  const theme = useTheme()
  return (
    <Pressable onPress={() => openLink(link.href)}>
      <Card
        backgroundColor={theme.contentBackground}
        borderColor={theme.fadedText}
        borderWidth={1}
        row
      >
        <PostThumbnail linkUrl={link.href} thumbSize={42} square />
        <View flex marginLeft="$0.5">
          <BodyText flex numberOfLines={1}>
            {link.text ?? link.href}
          </BodyText>
          <BodyText tiny flex numberOfLines={2}>
            {link.href}
          </BodyText>
        </View>
      </Card>
    </Pressable>
  )
}
