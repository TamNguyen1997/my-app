import { Node, nodeInputRule } from '@tiptap/core'

import { EMOJI_EMOTICONS, EMOTICON_REGEX, UNICODE_REGEX } from '../data/emoji'
import { parseTwemoji } from '../helpers/parse-twemoji'

const EmojiReplacer = Node.create({
  name: 'emojiReplacer',
  group: 'inline',
  inline: true,
  selectable: false,
  atom: true,
  addAttributes() {
    return {
      emoji: {
        default: null,
        parseHTML: (element) => element.children[0].getAttribute('alt'),
        renderHTML: (attributes) => {
          if (!attributes.emoji) {
            return {}
          }

          if (UNICODE_REGEX.test(attributes.emoji)) {
            return parseTwemoji(attributes.emoji)
          }

          return parseTwemoji(EMOJI_EMOTICONS[attributes.emoji])
        },
      },
    }
  },
  parseHTML() {
    return [{ tag: 'span[data-emoji-replacer]' }]
  },
  renderHTML({ HTMLAttributes }) {
    return ['span', { 'data-emoji-replacer': '' }, ['img', HTMLAttributes]]
  },
  renderText({ node }) {
    return node.attrs.emoji
  },
  addCommands() {
    return {
      insertEmoji: (emoji) => ({ tr, dispatch }) => {
        const node = this.type.create({ emoji })

        if (dispatch) {
          tr.replaceRangeWith(tr.selection.from, tr.selection.to, node)
        }

        return true
      },
    }
  },

  addInputRules() {
    return [
      nodeInputRule({
        find: EMOTICON_REGEX,
        type: this.type,
        getAttributes: (match) => {
          return {
            emoji: match[1],
          }
        },
      }),
      nodeInputRule({
        find: UNICODE_REGEX,
        type: this.type,
        getAttributes: (match) => ({
          emoji: match[0],
        }),
      }),
    ]
  },
})

export { EmojiReplacer }
