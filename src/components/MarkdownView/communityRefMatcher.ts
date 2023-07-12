const communityRefMatcher: any = {
  name: 'communityRef',
  level: 'inline', // Is this a block-level or inline-level tokenizer?
  start(src) {
    console.log('start')
    return src.match(/:[^:\n]/)?.index
  }, // Hint to Marked.js to stop and check for a match
  tokenizer(src, tokens) {
    const rule = /^(?:!)(.*)@(.*)$/ // Regex for the complete token, anchor to string start
    const match = rule.exec(src)
    console.log(match)
    if (match) {
      const token = {
        // Token to generate
        type: 'communityRef', // Should match "name" above
        raw: match[0], // Text to consume from the source
        user: match[0].trim(), // Additional custom properties
        domain: match[1].trim(), // Additional custom properties
        tokens: [] // Array where child inline tokens will be generated
      }
      return token
    }
  },
  renderer(token) {}
}

export default communityRefMatcher
