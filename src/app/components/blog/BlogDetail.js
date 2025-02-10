"use client"

import { BreadcrumbItem, Breadcrumbs, Link, Spinner } from "@nextui-org/react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import parse from 'html-react-parser';

import TableOfContent from "./TableOfContent"
import BlogNotFound from "@/components/BlogNotFound"
import "./BlogDetail.css"

const BlogContent = ({ blog }) => {
  return (<>
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
      style={{ "--tw-prose-bullets": "currentColor" }}
    >
      {blog.content ? parse(blog.content.rendered) : ""}
    </motion.div>
  </>)
}

const BlogDetail = ({ slug }) => {
  const [blog, setBlog] = useState({})
  const [relatedBlogs, setRelatedBlogs] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const getBlog = async () => {
    setIsLoading(true)
    const res = await fetch(`${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wp/v2/posts/?slug=${slug}&_embed&categories_exclude=${process.env.NEXT_PUBLIC_WORDPRESS_PRODUCT_CATEGORY_ID}`)
    if (!res.ok) {
      setNotFound(true)
    }
    const json = (await res.json())[0]
    if (!json || !json.content) {
      setNotFound(true)
    }
    setBlog(json)
    await fetch(`${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wp/v2/posts/?_embed&categories=${json.categories?.join()}&exclude=${json.id}&per_page=4&categories_exclude=${process.env.NEXT_PUBLIC_WORDPRESS_PRODUCT_CATEGORY_ID}`)
      .then(res => res.json())
      .then(json => setRelatedBlogs(json))
    setIsLoading(false)
    window.scrollTo(0, 0)
  }
  useEffect(() => {
    getBlog()
  }, [slug])

  if (isLoading) return <Spinner className="w-full h-full m-auto p-12" />
  if (notFound) return <BlogNotFound />
  return (
    <div className="bg-[#f6f6f6] font-open_san">
      <link rel="canonical" href={`${process.env.NEXT_PUBLIC_DOMAIN}/blog/${slug}`} />
      <div className="bg-opacity-40 py-6">
        <div className="container">
          <Breadcrumbs
            variant="light"
            className="font-semibold"
            itemClasses={{
              base: "[&>span]:text-[#23b701] last:[&>span]:text-black [&>span]:whitespace-normal"
            }}
          >
            <BreadcrumbItem href="/blog">Blog</BreadcrumbItem>
            <BreadcrumbItem>{blog.title.rendered}</BreadcrumbItem>
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
              {blog.title.rendered}
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
                      <Link href="" className="hover:underline transition">{item.title.rendered}</Link>
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