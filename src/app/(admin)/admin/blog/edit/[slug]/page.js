"use client";

import BlogForm from "@/components/admin/ui/BlogForm";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const EditBlog = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug || slug === "new") {
      return;
    }

    fetch(`/api/blogs/${slug}`)
      .then((res) => res.json())
      .then(setBlog)
      .then(() => setLoading(false));
  }, [slug]);

  console.log(blog);

  // if (loading) return <></>;
  return <BlogForm blog={blog} setBlog={setBlog} />;
};

export default EditBlog;
