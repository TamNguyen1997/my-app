"use client"

import { Card, CardBody, Tab, Tabs } from "@nextui-org/react"
import RichTextEditor from "@/components/admin/ui/RichTextArea"
import { useEditor } from "@tiptap/react"
import { editorConfig } from "@/lib/editor"
import { useEffect, useState } from "react"

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
        <Tab title="Chính sách bảo hành">
          <Card>
            <CardBody>
              <SupportPage slug="chinh-sach-bao-hanh" />
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
        <Tab title="Điều khoản dịch vụ">
          <Card>
            <CardBody>
              <SupportPage slug="dieu-khoan-dich-vu" />
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
        <Tab title="Phương thức vẫn chuyển">
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
    fetch(`/api/blogs/${slug}`).then(res => res.json()).then(json => {
      setBlog(json)
    })
  }, [slug])


  return (<>
    <RichTextEditor editor={editor} content={blog?.content} />
  </>)
}
