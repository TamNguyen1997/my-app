"use client"

import { BreadcrumbItem, Breadcrumbs, Link } from "@heroui/react";
import { motion } from "framer-motion";
import parse from 'html-react-parser';

import TableOfContent from "./TableOfContent"
import "./BlogDetail.css"

const BlogContent = ({ blog }) => {
  return (<>
    <motion.div
      initial={{ x: -50, opacity: 0 }}
      whileInView={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.7 }}
      viewport={{ once: true }}
      className="my-4"
    >
      <TableOfContent selector=".blog-content" />
    </motion.div>

    <motion.div
      initial={{ y: -50, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, delay: 0.3 }}
      viewport={{ once: true }}
      className={`
                [&_a]:text-primary
                [&_h2]:mt-[1.25em]
                [&_p]:my-[1.125em]
                max-w-full prose blog-content
              `}
      style={{ "--tw-prose-bullets": "currentColor" }}
    >
      {blog.content ? parse(blog.content.rendered || blog.content) : ""}
    </motion.div>
  </>)
}

const getSlug = (category) => {
  return category === "INFORMATION" ? "/kien-thuc-hay" : "/tin-tuc";
}

const getTitle = (category) => {
  return category === "INFORMATION" ? "Kiến thức hay" : "Tin tức";
}

const BlogDetail = ({ slug, blog, relatedBlogs = [], category = "INFORMATION" }) => {
  return (
    <div className="bg-[#f6f6f6] font-open_san">
      <div className="bg-opacity-40 py-6">
        <div className="container">
          <Breadcrumbs
            variant="light"
            className="font-semibold"
            itemClasses={{
              base: "[&>span]:text-[#23b701] last:[&>span]:text-black [&>span]:whitespace-normal"
            }}
          >
            <BreadcrumbItem href={`${getSlug(category)}`}>{getTitle(category)}</BreadcrumbItem>
            <BreadcrumbItem>
              {blog.title ? parse(blog.title.rendered || blog.title) : ""}
            </BreadcrumbItem>
          </Breadcrumbs>
        </div>
      </div>
      <div className="container pt-5 pb-20">
        <div className="bg-white rounded-lg">
          <div className="p-5 pb-20 mx-auto">
            <motion.h1
              initial={{ y: -100, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="text-3xl leading-[38px] font-semibold mb-4"
            >
              {blog.title ? parse(blog.title.rendered || blog.title) : ""}
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
              <span>Cập nhật: <b className="ml-1">{new Date(blog.modified).toLocaleDateString()}</b></span>
            </motion.div>

            <BlogContent blog={blog} />

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-sm bg-[#f2f4f9] rounded p-5 my-6"
            >
              <p className="font-semibold mb-4">Xem thêm</p>
              {
                relatedBlogs.map((item, index) => {
                  return (
                    <div className="flex items-center pl-4 mb-2" key={index}>
                      <div className="w-[5px] h-[5px] min-w-[5px] bg-black rounded-full mr-2"></div>
                      <Link href={`/kien-thuc-hay/${item.slug}`} className="hover:underline transition font-sans">{item.title.rendered}</Link>
                    </div>
                  )
                })
              }
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { BlogContent, BlogDetail }