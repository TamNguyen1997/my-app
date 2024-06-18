"use client";

import { useState } from "react";
import parse from 'html-react-parser'
import { useParams } from "next/navigation";
import { BreadcrumbItem, Breadcrumbs } from "@nextui-org/react";
import TableOfContent from "@/components/TableOfContent";
import RelatedBlog from "@/components/RelatedBlogs";
import Link from "next/link";
import { motion } from "framer-motion";

const Blog = () => {
  const [blog, setBlog] = useState({})
  const { _id } = useParams();
  useState(() => {
    fetch(`/api/blogs/${_id}`).then(res => res.json()).then(json => setBlog(json))
  }, [_id])

  if (!blog.id) return <></>

  return (
    <div className="bg-[#f6f6f6] blog-detail">
      <div className="bg-[#d4ff96] bg-opacity-40 py-6">
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
            <motion.h1
              initial={{ y: -100, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="text-3xl leading-[38px] font-semibold mb-4"
            >
              {blog.title}
            </motion.h1>

            <motion.div
              initial={{ x: -100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="text-sm text-[#6d6d6d] flex items-center mb-4"
            >
              <span>Đóng góp bởi: <b className="ml-1">{blog.author}</b></span>
              <span className="w-1 h-1 min-w-1 bg-[#e9e9e9] rounded-full mx-2"></span>
              <span>Cập nhật: <b className="ml-1">{new Date(blog.updatedAt).toLocaleDateString()}</b></span>
            </motion.div>
            
            <motion.p
              initial={{ x: -100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              Short description...
            </motion.p>

            <motion.div
              initial={{ x: -100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="my-4"
            >
              <TableOfContent selector=".blog-content" />
            </motion.div>
            
            <motion.div
              initial={{ y: -200, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              viewport={{ once: true }}
              className={`
                [&_img]:max-w-[75%]
                [&_img]:mx-auto
                [&_a]:text-primary
                [&_h2]:mt-[1.25em]
                [&_p]:my-[1.125em]
                max-w-full prose blog-content
              `}
              style={{"--tw-prose-bullets": "currentColor"}}
            >
              {parse(blog.content)}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-sm bg-[#f2f4f9] rounded p-5 my-6"
            >
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
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="mt-14"
            >
              <RelatedBlog />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;