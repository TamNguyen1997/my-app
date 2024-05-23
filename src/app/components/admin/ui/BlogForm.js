import { EditorContent, useEditor } from '@tiptap/react';
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
import { useState } from 'react';

const RichTextEditor = ({ blog }) => {
  const {
    register,
    handleSubmit
  } = useForm()
  const [isSelected, setIsSelected] = useState(blog?.active);
  const editor = useEditor({
    extensions: [
      StarterKit, Image,
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
        placeholder:
          'Nội dung bài viết...',
      })
    ],
    content: blog?.content
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
        <form onSubmit={handleSubmit(onSubmit)} className="flex items-center">
          <Input label="Tiêu đề" aria-label="Tiêu đề" {...register('title')} className="pr-3" defaultValue={blog?.title}></Input>
          <Switch isSelected={isSelected} onValueChange={setIsSelected}></Switch>
          <Button color="primary" type="submit" >Lưu</Button>
        </form>
        <Input label="Thumbnail" aria-label="Thumbnail" {...register('thumbnail')} defaultValue={blog?.thumbnail}></Input>
        {
          blog?.thumbnail
            ?
            <Image
              width={400}
              height={300}
              src={blog?.thumbnail}
              sizes="(max-width: 400px) 100vw, (max-width: 400px) 50vw, 33vw"
              className="h-full w-full object-cover object-center" />
            : <></>
        }
      </div>
    </div>
  );
};
export default RichTextEditor;