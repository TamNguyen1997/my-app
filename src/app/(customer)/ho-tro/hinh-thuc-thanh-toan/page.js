"use client"
import { BlogContent } from "@/components/blog/BlogDetail"
import { Spinner } from "@nextui-org/react"
import { useEffect, useState } from "react"

export default () => {
  const [blog, setBlog] = useState({ content: "" })

  useEffect(() => {
    fetch(`/api/blogs/hinh-thuc-thanh-toan`).then(res => res.json()).then(setBlog)
  }, [])
  if (!blog.id) return <Spinner className="flex m-auto pt-10 w-full h-full" />
  return (<>
    <div className="container pt-5 pb-20">
      <BlogContent blog={blog} />
    </div>
  </>)
}