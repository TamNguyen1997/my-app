import { joinShortcodes } from 'emojibase'
import EMOJIBASE_REGEX from 'emojibase-regex'
import emojis from 'emojibase-data/en/compact.json'
import shortcodes from 'emojibase-data/en/shortcodes/emojibase.json'
import escapeRegExp from 'lodash-es/escapeRegExp.js'

const emojisWithShortcodes = joinShortcodes(emojis, [shortcodes])

let EMOJI_EMOTICONS = {}
let EMOJI_SUGGESTIONS = []

let emoticonsForRegex = []

emojisWithShortcodes.forEach(({ unicode, emoticon, shortcodes }) => {

  if (emoticon) {
    emoticonsForRegex.push(escapeRegExp(emoticon))
    EMOJI_EMOTICONS[emoticon] = unicode
  }


  if (shortcodes) {
    EMOJI_SUGGESTIONS.push({
      emoji: unicode,
      shortcode: `:${shortcodes[0]}:`,
    })
  }
})


const EMOTICON_REGEX = new RegExp(`(${emoticonsForRegex.join('|')})\\s$`)


const UNICODE_REGEX = new RegExp(`${EMOJIBASE_REGEX.source}$`)

export { EMOJI_EMOTICONS, EMOJI_SUGGESTIONS, EMOTICON_REGEX, UNICODE_REGEX }