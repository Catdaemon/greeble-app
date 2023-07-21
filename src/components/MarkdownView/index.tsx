import { marked } from 'marked'
import { Fragment, ReactNode, useRef } from 'react'
import { Text } from 'react-native'
import { useTheme } from 'tamagui'
import openLink from '../../lib/openLink'
import { useAppSettingsStore } from '../../stores/appSettingsStore'
import Image from '../Core/Image'
import { BodyText, HeadingText, LinkText } from '../Core/Text'
import { View } from '../Core/View'
import Icon from '../Icon'
import LinkRow from '../LinkRow'
import communityRefMatcher from './communityRefMatcher'

export interface MarkdownViewProps {
  content: string
}

type LinkRegistrationFunction = (
  title: string,
  url: string,
  type: 'link' | 'image'
) => void

type TokenType =
  | 'space'
  | 'code'
  | 'heading'
  | 'table'
  | 'hr'
  | 'blockquote'
  | 'list'
  | 'list_item'
  | 'paragraph'
  | 'html'
  | 'text'
  | 'def'
  | 'escape'
  | 'image'
  | 'link'
  | 'strong'
  | 'em'
  | 'codespan'
  | 'br'
  | 'del'
const renderFuncs: Record<
  TokenType,
  (
    token: marked.Token,
    children?: ReactNode,
    registerLink?: LinkRegistrationFunction,
    theme?: ReturnType<typeof useTheme>
  ) => ReactNode
> = {
  space: (token: marked.Tokens.Space, children) => null,
  code: (token: marked.Tokens.Code, children, registerLink, theme) => {
    return (
      <View
        backgroundColor={theme.contentBackground}
        paddingHorizontal="$0.5"
        paddingVertical="$0.25"
        borderRadius={4}
      >
        {token.lang && (
          <View
            borderBottomWidth={1}
            borderBottomColor={theme.fadedText}
            marginBottom="$0.25"
            paddingBottom="$0.25"
          >
            <BodyText>{token.lang}</BodyText>
          </View>
        )}
        <BodyText>
          {token.text}
          {children}
        </BodyText>
      </View>
    )
  },
  heading: (token: marked.Tokens.Heading, children) => (
    <HeadingText>{children}</HeadingText>
  ),
  table: (token: marked.Tokens.Table, children) => <BodyText>table</BodyText>,
  hr: (token: marked.Tokens.Hr, children, registerLink, theme) => {
    return <View height={1} backgroundColor={theme.fadedText} />
  },
  blockquote: (
    token: marked.Tokens.Blockquote,
    children,
    registerLink,
    theme
  ) => {
    return (
      <View
        borderLeftColor={theme.fadedText}
        borderLeftWidth={2}
        paddingLeft="$0.5"
        paddingVertical="$0.25"
        marginVertical="$0.5"
      >
        <BodyText>{children}</BodyText>
      </View>
    )
  },
  list: (token: marked.Tokens.List, children) => (
    // TODO: multi level lists
    <View>{children}</View>
  ),
  list_item: (token: marked.Tokens.ListItem, children, registerLink, theme) => {
    if (token.task) {
      return (
        <View>
          {token.checked ? (
            <Icon name="CheckSquare" color="$textColor" />
          ) : (
            <Icon name="SquareIcon" color="$textColor" />
          )}
          <BodyText>{token.raw}</BodyText>
        </View>
      )
    }
    return <BodyText>- {token.raw}</BodyText>
  },
  paragraph: (token: marked.Tokens.Paragraph, children) => (
    <BodyText marginVertical="$0.5">{children}</BodyText>
  ),
  html: (token: marked.Tokens.HTML, children) => (
    <BodyText>{children}</BodyText>
  ),
  text: (token: marked.Tokens.Text, children) => (
    <Text>
      {token.raw}
      {children}
    </Text>
  ),
  def: (token: marked.Tokens.Def, children) => (
    <BodyText>
      <BodyText bold>{token.title}</BodyText>
      <BodyText>{token.tag}</BodyText>
      <BodyText>{token.href}</BodyText>
      {children}
    </BodyText>
  ),
  escape: (token: marked.Tokens.Escape, children) => (
    <BodyText>{token.raw}</BodyText>
  ),
  image: (token: marked.Tokens.Image, children, registerLink) => {
    registerLink(token.title, token.href, 'image')
    const showInline = useAppSettingsStore.getState().inlineCommentImages

    if (showInline) {
      return (
        <Image
          enableLightbox
          src={token.href}
          contentFit="contain"
          style={{
            width: '100%',
            aspectRatio: 1
          }}
        />
      )
    }

    return (
      <LinkText>
        <Icon name="Image" size={14} />
        {token.title ?? token.text ?? token.href}
        {children}
      </LinkText>
    )
  },
  link: (token: marked.Tokens.Link, children, registerLink) => {
    registerLink(token.text, token.href, 'link')
    return <LinkText onPress={() => openLink(token.href)}>{children}</LinkText>
  },
  strong: (token: marked.Tokens.Strong, children) => (
    <BodyText bold>{children}</BodyText>
  ),
  em: (token: marked.Tokens.Em, children) => (
    <BodyText italic>{children}</BodyText>
  ),
  codespan: (token: marked.Tokens.Codespan, children, registerLink, theme) => {
    return (
      <BodyText
        backgroundColor={theme.contentBackground}
        paddingHorizontal={4}
        paddingVertical={2}
        borderRadius={4}
      >
        {token.text}
        {children}
      </BodyText>
    )
  },
  br: (token: marked.Tokens.Br, children) => (
    <View marginTop="$1">{children}</View>
  ),
  del: (token: marked.Tokens.Del, children) => (
    <BodyText strike>{children}</BodyText>
  )
}

function renderToken(
  token: marked.Token,
  depth: string,
  registerLink: LinkRegistrationFunction,
  theme: ReturnType<typeof useTheme>
) {
  const renderFunc = renderFuncs[token.type]
  let innerId = 0
  const children =
    'tokens' in token
      ? token.tokens.map((token) => {
          innerId = innerId + 1
          return (
            <Fragment key={`${depth}-${innerId}`}>
              {renderToken(token, `${depth}+${innerId}`, registerLink, theme)}
            </Fragment>
          )
        })
      : undefined
  return (
    <Fragment key={depth}>
      {renderFunc(token, children, registerLink, theme)}
    </Fragment>
  )
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

    marked.use({
      extensions: [communityRefMatcher]
    })
    const lexer = new marked.Lexer({
      gfm: true
    })
    const output = lexer.lex(content)

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
