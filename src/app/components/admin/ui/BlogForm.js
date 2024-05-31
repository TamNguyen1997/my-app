import { EditorContent, Node, NodeViewWrapper, ReactNodeViewRenderer, mergeAttributes, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image'
import OrderedList from '@tiptap/extension-ordered-list'
import BulletList from '@tiptap/extension-bullet-list'
import BlogToolbar from "@/components/admin/ui/BlogToolBar"
import Placeholder from '@tiptap/extension-placeholder'
import Link from '@tiptap/extension-link'
import './Tiptap.css'
import { Button, Input, Switch } from '@nextui-org/react';
import { useForm } from "react-hook-form"
import { useCallback, useEffect, useState } from 'react';

const RichTextEditor = ({ blog }) => {
  const {
    register,
    handleSubmit
  } = useForm()

  const [isSelected, setIsSelected] = useState(blog?.active);
  const editor = useEditor({
    extensions: [
      StarterKit, Image, TableOfContents,
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
    content: blog.content
  });
  const onSubmit = (data) => {
    fetch('/api/blogs', {
      method: "POST",
      body: JSON.stringify({
        id: blog.id,
        title: data.title,
        content: editor.getHTML(),
        active: isSelected
      })
    }).then(() => window.location.reload())
  }

  const focus = () => {
    editor.commands.focus('end')
  }

  return (
    <div className="p-3">
      <BlogToolbar editor={editor} />
      <div className="h-full w-full shadow-md min-h-44 p-3 border" onClick={focus}>
        <EditorContent editor={editor} />
      </div>
      <div className="pt-3">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex items-center">
            <Input label="Tiêu đề" aria-label="Tiêu đề" {...register('title')} className="pr-3" defaultValue={blog?.title}></Input>
            <Switch isSelected={isSelected} onValueChange={setIsSelected}></Switch>
          </div>
          <div className="flex items-center">
            <Input label="Thumbnail" aria-label="Thumbnail" {...register('thumbnail')} defaultValue={blog?.thumbnail} className="pt-3 pr-3"></Input>
            <Button color="primary" type="submit">Lưu</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

const TableOfContents = Node.create({
  name: 'tableOfContents',
  group: 'block',
  atom: true,

  parseHTML() {
    return [
      {
        tag: 'toc',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['toc', mergeAttributes(HTMLAttributes)]
  },

  addNodeView() {
    return ReactNodeViewRenderer(Component)
  },

  addGlobalAttributes() {
    return [
      {
        types: ['heading'],
        attributes: {
          id: {
            default: null,
          },
        },
      },
    ]
  },
})

const Component = ({ editor }) => {
  const [items, setItems] = useState([])

  const handleUpdate = useCallback(() => {
    const headings = []
    const transaction = editor.state.tr

    editor.state.doc.descendants((node, pos) => {
      if (node.type.name === 'heading') {
        const id = `heading-${headings.length + 1}`

        if (node.attrs.id !== id) {
          transaction.setNodeMarkup(pos, undefined, {
            ...node.attrs,
            id,
          })
        }

        headings.push({
          level: node.attrs.level,
          text: node.textContent,
          id,
        })
      }
    })

    transaction.setMeta('addToHistory', false)
    transaction.setMeta('preventUpdate', true)

    editor.view.dispatch(transaction)

    setItems(headings)
  }, [editor])

  useEffect(handleUpdate, [])

  useEffect(() => {
    if (!editor) {
      return null
    }

    editor.on('update', handleUpdate)

    return () => {
      editor.off('update', handleUpdate)
    }
  }, [editor])

  return (
    <NodeViewWrapper className="toc">
      <ul className="toc__list">
        {items.map((item, index) => (
          <li key={index} className={`toc__item toc__item--${item.level}`}>
            <a href={`#${item.id}`}>{item.text}</a>
          </li>
        ))}
      </ul>
    </NodeViewWrapper>
  )
}

export default RichTextEditor;