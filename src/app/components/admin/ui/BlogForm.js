import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TipTapImage from '@tiptap/extension-image'
import OrderedList from '@tiptap/extension-ordered-list'
import BulletList from '@tiptap/extension-bullet-list'
import BlogToolbar from "../BlogToolBar"
import ImageCms from "../ImageCms";
import Placeholder from '@tiptap/extension-placeholder'
import Link from '@tiptap/extension-link'
import './Tiptap.css'
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Switch, Textarea, useDisclosure } from '@nextui-org/react';
import { useForm } from "react-hook-form"
import { useState } from 'react';
import Image from 'next/image';

const RichTextEditor = ({ blog }) => {
  const {
    register,
    handleSubmit
  } = useForm()

  const [isSelected, setIsSelected] = useState(blog?.active);
  const editor = useEditor({
    extensions: [
      StarterKit, TipTapImage,
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
    blog.thumbnail = value
    setThumbnail(value)
    onOpenChange()
  }

  return (
    <div className="p-3">
      <BlogToolbar editor={editor} />
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
                  <Image
                    src={`/gallery/${blog.thumbnail}`}
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
                <ImageCms disableAdd={true} onImageClick={selectedImage} disableDelete={true}></ImageCms>
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

export default RichTextEditor;