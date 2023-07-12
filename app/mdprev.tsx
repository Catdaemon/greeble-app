import { ScrollView } from 'react-native-gesture-handler'
import { SafeAreaView } from 'react-native-safe-area-context'
import MarkdownView from '../src/components/MarkdownView'

export default function MDPrev() {
  return (
    <SafeAreaView
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
    >
      <ScrollView>
        <MarkdownView
          content={`
# Heading 1
## Heading 2
### Heading 3

Paragraph text

Paragraph text with *italic*, **bold**, and ***bold italic*** text.

- List item 1
- List item 2
- List item 3
- - List item 3.1
- - List item 3.2
- - List item 3.3
- - - List item 3.3.1
- - - List item 3.3.2

1. Ordered list item 1
2. Ordered list item 2
3. Ordered list item 3

- [ ] Task 1
- [X] Task 2 checked
- [ ] Task 3

> Blockquote

\`inline code\`

\`\`\`js
// Code block
const a = 1
const b = 2
const c = a + b
\`\`\`

[Link](https://google.com)

![Image](https://picsum.photos/200/300)

| Table | Header |
| ----- | ------ |
| Table | Row    |
| Table | Row    |
| Table | Row    |

---
Horizontal rule

---
Horizontal rule
`}
        />
      </ScrollView>
    </SafeAreaView>
  )
}
