const userRefMatcher: any = {
  name: 'userRef',
  level: 'inline', // Is this a block-level or inline-level tokenizer?
  start(src) {
    return src.match(/@(\w+)@([\w.-]+)/)?.index
  }, // Hint to Marked.js to stop and check for a match
  tokenizer(src, tokens) {
    const rule = /^@(\w+)@([\w.-]+)/ // Regex for the complete token, anchor to string start
    const match = rule.exec(src)
    if (match) {
      const token = {
        // Token to generate
        type: 'userRef', // Should match "name" above
        raw: match[0], // Text to consume from the source
        user: match[1].trim(), // Additional custom properties
        domain: match[2].trim(), // Additional custom properties
        text: match[0],
        tokens: [] // Array where child inline tokens will be generated
      }
      return token
    }
  },
  renderer(token) {}
}

export default userRefMatcher
