"use client";

import { useEffect, useState } from "react";
import parse from 'html-react-parser'
import { useParams } from "next/navigation";
import { BreadcrumbItem, Breadcrumbs } from "@nextui-org/react";
import TableOfContent from "@/components/TableOfContent";
import RelatedBlog from "@/components/RelatedBlogs";
import Link from "next/link";
import { motion } from "framer-motion";
import BlogCarousel from "@/components/BlogCarousel";
import TopBlogs from "@/components/TopBlogs";
import BlogItem from "@/components/BlogItem";

const blogCategories = [
  {
    title: "Kiến thức hay",
    id: "INFORMATION",
    slug: "blog",
    tags: [
      {
        title: "Tất cả",
        slug: "",
        id: ""
      },
      {
        title: "Từ điển thuật ngữ",
        slug: "tu-dien-thuat-ngu",
        id: "TERMINOLOGY",
      },
      {
        title: "Tư vấn chọn mua",
        slug: "tu-van-chon-mua",
        id: "ADVISORY",
      },
      {
        title: "Hướng dẫn sử dụng",
        slug: "huong-dan-su-dung",
        id: "MANUAL",
      }
    ]
  },
  {
    title: "Tin tức",
    id: "NEWS",
    slug: "tin-tuc",
    tags: []
  }
];

const TAG_SLUGS = ["tu-van-chon-mua", "huong-dan-su-dung", "tu-dien-thuat-ngu"]

const Blog = () => {
  const { slug } = useParams();

  const category = slug[0] === "tin-tuc" ? "NEWS" : "INFORMATION"
  if (slug.length === 1) {
    switch (slug[0]) {
      case "tin-tuc":
        return <BlogOverview activeCategory="NEWS" />
      case "blog":
        return <BlogOverview activeCategory="INFORMATION" activeTag="" />
    }
  }

  if (slug.length === 2 && TAG_SLUGS.includes(slug[1])) {
    const activeTag = blogCategories.find(item => item.id === "INFORMATION").tags.find(item => item.slug === slug[1]).id
    return <BlogOverview activeCategory="INFORMATION" activeTag={activeTag} />
  }

  return <BlogDetail slug={slug[1].toString()} category={category.toString()} />
}

const BlogDetail = ({ slug, category }) => {
  const [blog, setBlog] = useState({})
  const [relatedBlogs, setRelatedBlogs] = useState([])

  useState(() => {
    fetch(`/api/blogs/${slug}`).then(res => res.json()).then(json => setBlog(json))
    fetch(`/api/blogs?blogCategory=${category}&size=4&page=1`).then(res => res.json()).then(setRelatedBlogs)
  }, [slug])

  if (!blog.id) return <></>

  return (
    <div className="bg-[#f6f6f6]">
      <div className="bg-opacity-40 py-6">
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
              {blog.summary}
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
              style={{ "--tw-prose-bullets": "currentColor" }}
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
                relatedBlogs.map((item, index) => {
                  return (
                    <div className="flex items-center pl-4 mb-2" key={index}>
                      <div className="w-[5px] h-[5px] min-w-[5px] bg-black rounded-full mr-2"></div>
                      <Link href="" className="hover:underline transition">{item.title}</Link>
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
              <RelatedBlog relatedBlogs={relatedBlogs} />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

const BlogOverview = ({ activeCategory, activeTag }) => {
  const [blogs, setBlogs] = useState([]);
  const [category, setCategory] = useState({});

  useEffect(() => {
    fetch(`/api/blogs?blogCategory=${activeCategory}&blogSubCategory=${activeTag}`).then(res => res.json()).then(json => {
      setBlogs(json)
      setCategory(blogCategories.find(item => item.id === activeCategory))
    })
  }, [activeCategory, activeTag])

  return (
    <>
      <div className="bg-[#f6f6f6]">
        <div className="container py-5">
          <motion.div
            className="bg-white rounded-lg p-5"
            initial={{ y: 100, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center space-x-6 mb-4">
              {
                blogCategories.map(category => {
                  return (
                    <Link
                      className={`
                        text-[17px] font-semibold cursor-pointer relative pb-2 
                        after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-[0px] 
                        after:bg-[#ffd300] after:h-[3px] after:transition-width
                        ${category.id === activeCategory && 'after:!w-[100%]'}
                      `}
                      key={category.id}
                      href={`/${category.slug}`}
                    >
                      {category.title}
                    </Link>
                  )
                })
              }
            </div>

            <div className="w-full flex flex-col lg:flex-row items-start lg:space-x-5">
              <div className="relative w-full lg:w-[57%] mb-5">
                <BlogCarousel items={blogs} />
              </div>
              <div className="w-full lg:w-[43%] mb-5">
                <TopBlogs items={blogs.slice(0, 4)} />
              </div>
            </div>

            <div className="w-full border border-[#ebebeb] mb-6"></div>

            <div className="mb-10" key={category.id}>
              <div className="text-xl text-[#191919] leading-none font-bold uppercase border-l-4 border-[#ffd300] pl-3 mb-4">{category.title}</div>
              <div className="flex flex-wrap">
                {
                  category.tags?.map(tag => {
                    return (
                      <Link
                        className={`
                                text-[13px] rounded bg-[#f2f4f9] cursor-pointer transition
                                flex items-center justify-center text-center px-2 pt-1 pb-0.5 mr-2 mb-4
                                ${tag.id === activeTag && 'bg-black text-white'}
                              `}
                        key={tag.id}
                        href={`/blog/${tag.slug}`}
                      >
                        {tag.title}
                      </Link>
                    )
                  })
                }
              </div>

              <div className="space-y-4 mb-2">
                {
                  blogs.map(item => {
                    return (
                      <BlogItem item={item} key={item.id} containerClass="lg:grid-cols-[192px_auto] pb-5" />
                    )
                  })
                }
              </div>

              <Link
                href=""
                className="flex justify-center items-center text-[#153f17] font-semibold w-[181px] h-[43px] rounded-[30px] border border-[#ffd300] hover:bg-[#ccefdc] transition mx-auto"
              >
                Xem tất cả
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Blog;
