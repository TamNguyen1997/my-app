"use client";

import { useState } from "react";
import parse from 'html-react-parser'
import { useParams } from "next/navigation";
// import "./blog.css"
import { BreadcrumbItem, Breadcrumbs, Button } from "@nextui-org/react";
import TableOfContent from "@/components/TableOfContent";
import RelatedBlog from "@/components/RelatedBlogs";
import Link from "next/link";

const Blog = () => {
  const [blog, setBlog] = useState({})
  const { _id } = useParams();
  useState(() => {
    fetch(`/api/blogs/${_id}`).then(res => res.json()).then(json => setBlog(json))
  }, [_id])

  if (!blog.id) return <></>

  return (
    // <div className="bg-[#f6f6f6]">
    //   <div className="mx-auto w-2/5 p-3 blog bg-white">
    //     <Breadcrumbs variant="solid">
    //       <BreadcrumbItem>Home</BreadcrumbItem>
    //       <BreadcrumbItem>Music</BreadcrumbItem>
    //       <BreadcrumbItem>Artist</BreadcrumbItem>
    //       <BreadcrumbItem>Album</BreadcrumbItem>
    //       <BreadcrumbItem>Song</BreadcrumbItem>
    //     </Breadcrumbs>
    //     <div className="p-5 pt-10">
    //       {parse(blog.content)}
    //     </div>
    //   </div>
    // </div>

    <div className="bg-[#f6f6f6]">
      <div className="bg-[#d4ff96] py-6">
        <div className="container">
          <Breadcrumbs
            variant="light"
            className="font-semibold"
            itemClasses={{
              base: "[&>span]:text-[#23b701] last:[&>span]:text-black"
            }}
          >
            <BreadcrumbItem href="/blog">Blog</BreadcrumbItem>
            <BreadcrumbItem>{blog.title}</BreadcrumbItem>
          </Breadcrumbs>
        </div>
      </div>
      <div className="container pt-5 pb-20">
        <div className="bg-white rounded-lg">
          <div className="max-w-[860px] p-5 pb-20 mx-auto">
            <h1 className="text-3xl font-semibold mb-4">{blog.title}</h1>

            <div className="text-sm text-[#6d6d6d] flex items-center mb-4">
              <span>Đóng góp bởi: <b className="ml-1">Võ Thị Mỹ Duyên</b></span>
              <span className="w-1 h-1 min-w-1 bg-[#e9e9e9] rounded-full mx-2"></span>
              <span>Cập nhật: <b className="ml-1">18/05/2024</b></span>
            </div>
            
            <p>Short description...</p>

            <div className="my-4">
              <TableOfContent selector=".blog-content" />
            </div>
            
            <div className="prose blog-content">
              {parse(blog.content)}
            </div>

            <div className="text-sm bg-[#f2f4f9] rounded p-5 my-6">
              <p className="font-semibold mb-4">Xem thêm</p>
              {
                [...Array(3)].map((_, index) => {
                  return (
                    <div className="flex items-center pl-4 mb-2" key={index}>
                      <div className="w-[5px] h-[5px] min-w-[5px] bg-black rounded-full mr-2"></div>
                      <Link href="" className="hover:underline transition">Số thẻ ngân hàng là gì? Phân biệt số thẻ và số tài khoản ngân hàng {index + 1}</Link>
                    </div>
                  )
                })
              }
            </div>

            <div className="w-full h-2 bg-[url(/line-bg.png)]"></div>

            <div className="pt-8 pb-10 flex flex-col items-end">
              <p className="mb-3">Bài viết có hữu ích không?</p>
              <div className="flex space-x-5">
                <Button className="border-[thin]" variant="bordered">Có</Button>
                <Button className="border-[thin]" variant="bordered">Không</Button>
              </div>
            </div>

            <div className="w-full h-2 bg-[url(/line-bg.png)]"></div>

            <div className="mt-14">
              <RelatedBlog />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;
