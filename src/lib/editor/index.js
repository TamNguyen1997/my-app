import StarterKit from '@tiptap/starter-kit';
import TipTapImage from '@tiptap/extension-image'
import OrderedList from '@tiptap/extension-ordered-list'
import BulletList from '@tiptap/extension-bullet-list'
import Placeholder from '@tiptap/extension-placeholder'
import TipTapBold from '@tiptap/extension-bold';
import TipTapItalic from '@tiptap/extension-italic';
import HardBreak from '@tiptap/extension-hard-break'
import TextAlign from '@tiptap/extension-text-align'
import Highlight from '@tiptap/extension-highlight'
import Underline from '@tiptap/extension-underline'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import TextStyle from '@tiptap/extension-text-style'
import Table from '@tiptap/extension-table'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'
import Gapcursor from '@tiptap/extension-gapcursor'
import ListKeymap from '@tiptap/extension-list-keymap'
import { Color } from '@tiptap/extension-color'
import Link from '@tiptap/extension-link'
import { EmojiReplacer } from '@/components/admin/ui/extensions/EmojiReplacer'

const editorConfig = (content) => {
  return {
    extensions: [
      StarterKit, TipTapImage, TipTapBold, TipTapItalic, Underline, HardBreak, Subscript, Superscript, TextStyle, Color,
      Table.configure({
        resizable: true,
      }),
      ListKeymap,
      TableRow, Gapcursor,
      EmojiReplacer,
      TableHeader,
      TableCell,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      OrderedList.configure({
        HTMLAttributes: {
          class: 'list-decimal'
        }
      }),
      BulletList.configure({
        HTMLAttributes: {
          class: 'list-disc'
        }
      }),
      Link.configure({
        protocols: ["http", "https"]
      }),
      Placeholder.configure({
        placeholder: "Nhập văn bản"
      })
    ],
    content: content || "<br><br><br><br><br><br><br>"
  }
}

export { editorConfig }