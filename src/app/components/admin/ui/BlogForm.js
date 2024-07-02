import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TipTapImage from '@tiptap/extension-image'
import OrderedList from '@tiptap/extension-ordered-list'
import BulletList from '@tiptap/extension-bullet-list'
import ImagePicker from "@/components/admin/ui/ImagePicker";
import Placeholder from '@tiptap/extension-placeholder'
import TipTapBold from '@tiptap/extension-bold';
import TipTapItalic from '@tiptap/extension-italic';
import HardBreak from '@tiptap/extension-hard-break'
import TextAlign from '@tiptap/extension-text-align'
import Highlight from '@tiptap/extension-highlight'
import Underline from '@tiptap/extension-underline'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import Link from '@tiptap/extension-link'
import './Tiptap.css'
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Switch, Textarea, useDisclosure } from '@nextui-org/react';
import { useForm } from "react-hook-form"
import { useState } from 'react';

import {
  RiBold,
  RiItalic,
  RiStrikethrough,
  RiCodeSSlashLine,
  RiH1,
  RiH2,
  RiListOrdered,
  RiListUnordered,
  RiLink,
  RiImage2Fill,
  RiAlignLeft,
  RiAlignCenter,
  RiAlignRight,
  RiAlignJustify,
  RiUnderline,
  RiH3,
  RiH4,
  RiTextWrap,
  RiSubscript,
  RiSubscript2,
  RiSuperscript2
} from 'react-icons/ri'
import { LucideHighlighter } from 'lucide-react';

const RichTextEditor = ({ blog }) => {
  const {
    register,
    handleSubmit
  } = useForm()

  const [isSelected, setIsSelected] = useState(blog?.active);

  const editor = useEditor({
    extensions: [
      StarterKit, TipTapImage, TipTapBold, TipTapItalic, Underline, HardBreak, Subscript, Superscript,
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
    content: blog.content
  })

  const onSubmit = async (data) => {
    data.thumbnail = thumbnail

    await fetch('/api/blogs', {
      method: "POST",
      body: JSON.stringify({
        id: blog.id,
        title: data.title,
        content: editor.getHTML(),
        active: isSelected,
        thumbnail: thumbnail
      })
    })
    window.location.reload()
  }

  const focus = () => {
    if (!blog.content) {
      editor.commands.focus('end')
    }
  }

  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  const [thumbnail, setThumbnail] = useState(blog?.thumbnail)
  const selectedImage = (value) => {
    blog.thumbnail = value.path
    setThumbnail(value.path)
    onOpenChange()
  }

  return (
    <div className="p-3">
      <BlogToolBar editor={editor} />
      <div className="h-full w-full shadow-md min-h-44 p-3 border" onClick={focus}>
        <EditorContent editor={editor} />
      </div>
      <div className="pt-3 pr-3">
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-3'>
          <div>
            <Textarea label="Tóm tắt" aria-label="Tóm tắt" {...register('summary')} value={blog?.summary}></Textarea>
          </div>
          <div className="flex gap-3">
            <Input label="Tiêu đề" aria-label="Tiêu đề" {...register('title')} defaultValue={blog?.title}></Input>
            <Switch isSelected={isSelected} onValueChange={setIsSelected}></Switch>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className='flex flex-col gap-3'>
              <Input label="Thumbnail" aria-label="Thumbnail" {...register('thumbnail')} value={blog?.thumbnail} disabled></Input>
              <div>
                <div className="float-right flex gap-3">
                  <Button onClick={onOpen}>Chọn ảnh</Button>
                  <Button color="primary" type="submit">Lưu</Button>
                </div>
              </div>
            </div>
            <div>
              {
                blog?.thumbnail ?
                  <img
                    src={`${process.env.NEXT_PUBLIC_FILE_PATH + blog.thumbnail}`}
                    width="300"
                    height="300"
                    alt="Thumbnail image"
                  /> : null
              }
            </div>
          </div>
        </form>
      </div>

      <Modal
        size="5xl" scrollBehavior="inside"
        isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Chọn hình ảnh</ModalHeader>
              <ModalBody>
                <ImagePicker disableAdd={true} onImageClick={selectedImage} disableDelete={true}></ImagePicker>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

const BlogToolBar = ({ editor }) => {
  const iconClassName = "border w-6 h-6 justify-items-center items-center"
  const imageModal = useDisclosure();
  const linkModal = useDisclosure();
  const [hyperlink, setHyperlink] = useState('')
  if (!editor) {
    return <></>
  }

  const insertLink = () => {
    if (!hyperlink) {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: hyperlink }).run()
  }

  return (
    <div className="flex p-3">
      <div className="w-1/4"></div>
      <div className="flex w-1/2">
        <div className={`${iconClassName} ${editor.isActive('bold') ? "opacity-25" : ""}`}
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleBold().run();
          }}>
          <RiBold className="w-full h-full" />
        </div>
        <div className={`${iconClassName} ${editor.isActive('italic') ? "opacity-25" : ""}`}
          onClick={() => editor.chain().focus().toggleItalic().run()}>
          <RiItalic className="w-full h-full" />
        </div>
        <div className={`${iconClassName} ${editor.isActive('strike') ? "opacity-25" : ""}`}
          onClick={() => editor.chain().focus().toggleStrike().run()}>
          <RiStrikethrough className="w-full h-full" />
        </div>
        <div className={`${iconClassName} ${editor.isActive('underline') ? "opacity-25" : ""}`}
          onClick={() => editor.chain().focus().setUnderline().run()}>
          <RiUnderline className="w-full h-full" />
        </div>
        <div className={`${iconClassName} ${editor.isActive('code') ? "opacity-25" : ""}`}
          onClick={() => editor.chain().focus().toggleCode().run()}>
          <RiCodeSSlashLine className="w-full h-full" />
        </div>
        <div className="pr-5"></div>
        <div className={`${iconClassName} ${editor.isActive('heading', { level: 1 }) ? "opacity-25" : ""}`}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
          <RiH1 className="w-full h-full" />
        </div>

        <div className={`${iconClassName} ${editor.isActive('heading', { level: 2 }) ? "opacity-25" : ""}`}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
          <RiH2 className="w-full h-full" />
        </div>
        <div className={`${iconClassName} ${editor.isActive('heading', { level: 3 }) ? "opacity-25" : ""}`}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
          <RiH3 className="w-full h-full" />
        </div>
        <div className={`${iconClassName} ${editor.isActive('heading', { level: 4 }) ? "opacity-25" : ""}`}
          onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}>
          <RiH4 className="w-full h-full" />
        </div>
        <div className="pr-5"></div>
        <div className={`${iconClassName} ${editor.isActive('orderedList') ? "opacity-25" : ""}`}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          <RiListOrdered className="w-full h-full" />
        </div>
        <div className={`${iconClassName} ${editor.isActive('bulletList') ? "opacity-25" : ""}`}
          onClick={() => editor.chain().focus().toggleBulletList().run()}>
          <RiListUnordered className="w-full h-full" />
        </div>
        <div className={`${iconClassName} ${editor.isActive({ textAlign: 'left' }) ? "opacity-25" : ""}`}
          onClick={() => editor.chain().focus().setTextAlign("left").run()}>
          <RiAlignLeft className="w-full h-full" />
        </div>
        <div className={`${iconClassName} ${editor.isActive({ textAlign: 'center' }) ? "opacity-25" : ""}`}
          onClick={() => editor.chain().focus().setTextAlign("center").run()}>
          <RiAlignCenter className="w-full h-full" />
        </div>
        <div className={`${iconClassName} ${editor.isActive({ textAlign: 'right' }) ? "opacity-25" : ""}`}
          onClick={() => editor.chain().focus().setTextAlign("right").run()}>
          <RiAlignRight className="w-full h-full" />
        </div>
        <div className={`${iconClassName} ${editor.isActive({ textAlign: 'justify' }) ? "opacity-25" : ""}`}
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}>
          <RiAlignJustify className="w-full h-full" />
        </div>
        <div className="pr-5"></div>
        <div className={iconClassName}
          onClick={imageModal.onOpen}>
          <RiImage2Fill className="w-full h-full" />
        </div>
        <div className={iconClassName} onClick={linkModal.onOpen}>
          <RiLink className="w-full h-full" />
        </div>

        <div className="pr-5"></div>
        <div className={iconClassName}
          onClick={() => editor.chain().focus().setHardBreak().run()}>
          <RiTextWrap className="w-full h-full" />
        </div>
        <div className={`${iconClassName} ${editor.isActive('highlight') ? "opacity-25" : ""}`}
          onClick={() => editor.chain().focus().toggleHighlight().run()}>
          <LucideHighlighter className="w-full h-full" />
        </div>
        <div className={`${iconClassName} ${editor.isActive('subscript') ? "opacity-25" : ""}`}
          onClick={() => editor.chain().focus().toggleSubscript().run()}>
          <RiSubscript2 className="w-full h-full" />
        </div>
        <div className={`${iconClassName} ${editor.isActive('superscript') ? "opacity-25" : ""}`}
          onClick={() => editor.chain().focus().toggleSuperscript().run()}>
          <RiSuperscript2 className="w-full h-full" />
        </div>
      </div>
      <div className="w-1/4"></div>
      <Modal isOpen={imageModal.isOpen} onOpenChange={imageModal.onOpenChange} size="5xl" scrollBehavior="inside">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Chèn hình</ModalHeader>
              <ModalBody>
                <ImagePicker disableAdd onImageClick={(image) => {
                  editor.chain().focus().setImage({ src: image.path }).run()
                  onClose()
                }} disableDelete></ImagePicker>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Đóng
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <Modal isOpen={linkModal.isOpen} onOpenChange={linkModal.onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Chèn hình ảnh</ModalHeader>
              <ModalBody>
                <Input label="Link" aria-label="Link" defaultValue={editor.getAttributes('link').href} onValueChange={setHyperlink}></Input>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Đóng
                </Button>
                <Button color="primary" onPress={() => {
                  insertLink()
                  onClose()
                }}>
                  Lưu
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  )
}

export default RichTextEditor;