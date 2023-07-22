import { useRef } from 'react'
import { useTheme } from 'tamagui'
import { useAppSettingsStore } from '../../stores/appSettingsStore'
import { View } from '../Core/View'
import LinkRow from '../LinkRow'
import getMarkdownTokens from './configureMarked'
import { renderToken } from './reactNativeRenderer'

export interface MarkdownViewProps {
  content: string
}

type Link = { text: string; href: string }

export default function MarkdownView({ content }: MarkdownViewProps) {
  const theme = useTheme()
  const [showLinkBlock] = useAppSettingsStore((state) => [
    state.showCommentLinkBlock
  ])
  const links = useRef<Link[]>([])

  const renderMarkdown = () => {
    links.current = []
    const _links: Link[] = []
    const registerLink = (text: string, href: string) => {
      if (showLinkBlock) {
        _links.push({ text, href })
      }
    }

    const output = getMarkdownTokens(content)

    const renderedMarkdown = output.map((token, i) =>
      renderToken(token, i.toString(), registerLink, theme)
    )
    links.current = _links
    return renderedMarkdown
  }

  return (
    <View
      style={{
        gap: 16,
        flex: 1
      }}
    >
      <View>{renderMarkdown()}</View>
      {links.current.length > 0 && (
        <View paddingTop="$0.5" gap="$0.5">
          {links.current.map((link, i) => (
            <LinkRow key={i} link={link} />
          ))}
        </View>
      )}
    </View>
  )
}
