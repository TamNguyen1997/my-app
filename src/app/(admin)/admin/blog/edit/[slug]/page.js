"use client"

import BlogForm from "@/components/admin/ui/BlogForm"
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const EditBlog = () => {
  const { slug } = useParams()
  const [blog, setBlog] = useState({})

  useEffect(() => {
    if (!slug || slug === "new") {
      return
    }

    fetch(`/api/blogs/${slug}`).then(res => res.json()).then(setBlog)
  }, [slug])

  return (
    <BlogForm blog={blog} setBlog={setBlog} />
  );
};

export default EditBlog;
