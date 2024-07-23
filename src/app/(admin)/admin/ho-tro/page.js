"use client"

import { Button, Card, CardBody, Input, Tab, Tabs } from "@nextui-org/react"
import RichTextEditor from "@/components/admin/ui/RichTextArea"
import { useEditor } from "@tiptap/react"
import { editorConfig } from "@/lib/editor"
import { useEffect, useState } from "react"
import { toast, ToastContainer } from "react-toastify"

export default () => {
  return (
    <div>
      <Tabs>
        <Tab title="Hỗ trợ">
          <Card>
            <CardBody>
              <SupportPage slug="ho-tro" />
            </CardBody>
          </Card>
        </Tab>
        <Tab title="Chính sách bảo mật">
          <Card>
            <CardBody>
              <SupportPage slug="chinh-sach-bao-mat" />
            </CardBody>
          </Card>
        </Tab>
        <Tab title="Chính sách đổi trả">
          <Card>
            <CardBody>
              <SupportPage slug="chinh-sach-doi-tra" />
            </CardBody>
          </Card>
        </Tab>
        <Tab title="Hướng dẫn mua hàng">
          <Card>
            <CardBody>
              <SupportPage slug="huong-dan-mua-hang" />
            </CardBody>
          </Card>
        </Tab>
        <Tab title="Phương thức thanh toán">
          <Card>
            <CardBody>
              <SupportPage slug="phuong-thuc-thanh-toan" />
            </CardBody>
          </Card>
        </Tab>
        <Tab title="Phương thức vận chuyển">
          <Card>
            <CardBody>
              <SupportPage slug="phuong-thuc-van-chuyen" />
            </CardBody>
          </Card>
        </Tab>
      </Tabs>
    </div>
  )
}

const SupportPage = ({ slug }) => {
  const [blog, setBlog] = useState({ content: "" })
  const editor = useEditor(editorConfig())

  useEffect(() => {
    fetch(`/api/blogs/${slug}`).then(res => res.json()).then(setBlog)
  }, [slug])

  const onSubmit = async (e) => {
    e.preventDefault()
    const res = await fetch(`/api/blogs`, {
      method: "POST",
      body: JSON.stringify(Object.assign(blog, { content: editor.getHTML() }))
    })

    if (res.ok) {
      toast.success("Đã cập nhật")
    } else {
      toast.error("Không thể cập nhật")
    }
  }

  return (<>
    <ToastContainer />
    <RichTextEditor editor={editor} content={blog?.content} />
    <form className="flex flex-col gap-3 pt-3" onSubmit={onSubmit}>
      <div className="flex gap-3">
        <Input label="Tiêu đề" aria-label="Tiêu đề" value={blog.title} onValueChange={(value) => setBlog(Object.assign({}, blog, { title: value }))} />
        <Input label="Slug" aria-label="Slug" value={blog.slug} disabled />
      </div>
      <div className='flex gap-3'>
        <Input label="Meta title" aria-label="Meta title" value={blog.metaTitle} onValueChange={(value) => setBlog(Object.assign({}, blog, { metaTitle: value }))} />
        <Input label="Meta description" aria-label="Meta description" value={blog.metaDescription} onValueChange={(value) => setBlog(Object.assign({}, blog, { metaDescription: value }))} />
      </div>
      <div className="text-right items-end">
        <Button color="primary" type="submit">Lưu</Button>
      </div>
    </form>
  </>)
}
