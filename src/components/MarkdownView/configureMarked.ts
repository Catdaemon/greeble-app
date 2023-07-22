import { marked } from 'marked'
import communityRefMatcher from './communityRefMatcher'
import userRefMatcher from './userRefMatcher'

marked.use({
  extensions: [communityRefMatcher, userRefMatcher],
  smartypants: false,
  mangle: false,
  gfm: false
})

export default function getMarkdownTokens(content: string) {
  const lexer = new marked.Lexer()
  return lexer.lex(content)
}
