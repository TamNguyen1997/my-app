"use client";

import { useState } from "react";
import parse from 'html-react-parser'
import { useParams } from "next/navigation";
import "./blog.css"
import { BreadcrumbItem, Breadcrumbs } from "@nextui-org/react";

const Blog = () => {
  const [blog, setBlog] = useState({})
  const { _id } = useParams();
  useState(() => {
    fetch(`/api/blogs/${_id}`).then(res => res.json()).then(json => setBlog(json))
  }, [_id])

  if (!blog.id) return <></>

  return (
    <div className="bg-[#f6f6f6]">
      <div className="mx-auto w-2/5 p-3 blog bg-white">
        <Breadcrumbs variant="solid">
          <BreadcrumbItem>Home</BreadcrumbItem>
          <BreadcrumbItem>Music</BreadcrumbItem>
          <BreadcrumbItem>Artist</BreadcrumbItem>
          <BreadcrumbItem>Album</BreadcrumbItem>
          <BreadcrumbItem>Song</BreadcrumbItem>
        </Breadcrumbs>
        <div className="p-5 pt-10">
          {parse(blog.content)}
        </div>
      </div>
    </div>
  );
};

export default Blog;
