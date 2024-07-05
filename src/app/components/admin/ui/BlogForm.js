import { useEditor } from '@tiptap/react';
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
import TextStyle from '@tiptap/extension-text-style'
import Table from '@tiptap/extension-table'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'
import Gapcursor from '@tiptap/extension-gapcursor'
import ListKeymap from '@tiptap/extension-list-keymap'
import { Color } from '@tiptap/extension-color'
import Link from '@tiptap/extension-link'
import { Button, DatePicker, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, Switch, Textarea, useDisclosure } from '@nextui-org/react';
import { useForm } from "react-hook-form"
import { useState } from 'react';
import RichTextEditor from './RichTextArea';
import { EmojiReplacer } from './extensions/EmojiReplacer'

import slugify from "slugify"
import { parseDate } from "@internationalized/date";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BLOG_CATEGORIES = [
  {
    id: "INFORMATION",
    value: "Kiến thức hay"
  },
  {
    id: "NEWS",
    value: "Tin tức"
  }
]

const BLOG_SUB_CATEGORIES = [
  {
    value: "Từ điển thuật ngữ",
    id: "TERMINOLOGY",
  },
  {
    value: "Tư vấn chọn mua",
    id: "ADVISORY",
  },
  {
    value: "Hướng dẫn sử dụng",
    id: "MANUAL",
  }
]

const BlogForm = ({ blog, setBlog }) => {
  const {
    register,
    handleSubmit
  } = useForm()

  const [isSelected, setIsSelected] = useState(blog?.active);

  const editor = useEditor({
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
    content: blog.content || "<br><br><br><br><br><br><br>"
  })

  const onSubmit = async (data) => {
    const body = Object.assign(blog, data, { thumbnail: thumbnail, content: editor.getHTML(), active: isSelected })
    const res = await fetch('/api/blogs', {
      method: "POST",
      body: JSON.stringify(body)
    })
    if (!res.ok) {
      toast.error((await res.json()).message)
      return
    }
    window.location.reload()
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
      <ToastContainer />
      <RichTextEditor editor={editor} />
      <div className="pt-3 pr-3">
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-3'>
          <div className="flex gap-3">
            <Input label="Tiêu đề" aria-label="Tiêu đề" value={blog?.title}
              onValueChange={(value) => setBlog(Object.assign(
                {},
                blog,
                { title: value, slug: slugify(value, { locale: 'vi' }).toLowerCase() }))}
            ></Input>
            <Input label="Slug" aria-label="Slug" value={blog?.slug} disabled></Input>
          </div>
          <div className='flex gap-3'>
            <Input label="Meta title" aria-label="Meta title" {...register('metaTitle')} defaultValue={blog?.metaDescription}></Input>
            <Input label="Meta description" aria-label="Meta description" {...register('metaDescription')} defaultValue={blog?.metaDescription}></Input>
          </div>
          <div>
            <Textarea label="Tóm tắt" aria-label="Tóm tắt" {...register('summary')} defaultValue={blog?.summary}></Textarea>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className='flex flex-col gap-3'>
              <div className='flex gap-3'>
                <Input label="Thumbnail" aria-label="Thumbnail" {...register('thumbnail')} value={blog?.thumbnail} disabled></Input>
                <div className='pt-2'>
                  <Button onClick={onOpen} className=''>Chọn ảnh</Button>
                </div>
              </div>
              <Input label="Alt bài viết" aria-label="Thumbnail" {...register('altThumb')} defaultValue={blog?.altThumb}></Input>
              <Input label="Keyword" aria-label="Keyword" {...register('keyword')} defaultValue={blog?.keyword}></Input>
              <Input label="Tác giả" aria-label="Keyword" {...register('author')} defaultValue={blog?.author}></Input>
              <Select
                label="Phân loại"
                defaultSelectedKeys={new Set([blog.blogCategory])}
                onSelectionChange={
                  (value) => setBlog(Object.assign({}, blog, { blogCategory: value.values().next().value }))
                }
              >
                {
                  BLOG_CATEGORIES.map((category) => (
                    <SelectItem key={category.id}>
                      {category.value}
                    </SelectItem>
                  ))
                }
              </Select>
              <Select
                label="Sub Category"
                defaultSelectedKeys={new Set([blog.blogSubCategory])}
                onSelectionChange={
                  (value) => setBlog(Object.assign({}, blog, { blogSubCategory: value.values().next().value }))
                }
              >
                {
                  BLOG_SUB_CATEGORIES.map((subcate) => (
                    <SelectItem key={subcate.id}>
                      {subcate.value}
                    </SelectItem>
                  ))
                }
              </Select>
              <div className='flex gap-3'>
                <DatePicker label="Ngày publish"
                  onChange={(value) => setBlog(Object.assign({}, blog, { activeFrom: new Date(value.toString()) }))}
                  defaultValue={blog.activeFrom ? getDateString(blog.activeFrom) : ""}
                  aria-label="Ngày publish"></DatePicker>
                <Switch isSelected={isSelected} onValueChange={setIsSelected}></Switch>
              </div>
              <div>
                <div className="float-right flex gap-3">
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

const getDateString = (isoDate) => parseDate(new Date(isoDate).toISOString().split('T')[0])

export default BlogForm;