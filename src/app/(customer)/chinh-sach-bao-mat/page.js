"use client"
import { BlogContent } from "@/components/blog/BlogDetail"
import { useEffect, useState } from "react"

export default () => {
  const [blog, setBlog] = useState({ content: "" })

  useEffect(() => {
    fetch(`/api/blogs/chinh-sach-bao-mat`).then(res => res.json()).then(setBlog)
  }, [])
  if (!blog.id) return <></>
  return (<>
    <div className="container pt-5 pb-20">
      <BlogContent blog={blog} />
    </div>
  </>)
}