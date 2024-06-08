"use client";

import { Link } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { Home } from "lucide-react";
import BlogItem from "@/components/BlogItem";
import BlogCarousel from "@/components/BlogCarousel";
import TopBlogs from "@/components/TopBlogs";
import { motion } from "framer-motion";

const blogCategories = [
  {
    title: "Blog",
    slug: ""
  },
  {
    title: "Quản lý tài chính",
    slug: "quan-ly-tai-chinh"
  },
  {
    title: "Tích lũy",
    slug: "tich-luy"
  },
  {
    title: "Đầu tư",
    slug: "dau-tu"
  },
  {
    title: "Phúc lợi xã hội",
    slug: "phuc-loi-xa-hoi"
  }
];

const blogTags = [
  {
    title: "Tất cả",
    slug: ""
  },
  {
    title: "Kiến thức tài chính",
    slug: "kien-thuc-tai-chinh"
  },
  {
    title: "Tài chính gia đình",
    slug: "tai-chinh-gia-dinh"
  },
  {
    title: "Thu nhập và chi tiêu",
    slug: "thu-nhap-va-chi-tieu"
  },
  {
    title: "Tài chính cá nhân",
    slug: "tai-chinh-ca-nhan"
  }
]

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [activeCategory, setActiveCategory] = useState("");
  const [activeTag, setActiveTag] = useState("");

  useEffect(() => {
    fetch("/api/blogs").then(res => res.json()).then(setBlogs)
  }, [])

  if (blogs.length === 0) return <></>
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
              <Home className="cursor-pointer mb-2" color="#83e214" size="20" onClick={() => setActiveCategory('')} />              
              {
                blogCategories.map(category => {
                  return (
                    <div
                      className={`
                        text-[17px] font-semibold cursor-pointer relative pb-2 
                        after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-[0px] after:bg-[#83e214] after:h-[3px] after:transition-width
                        ${category.slug === activeCategory && 'after:!w-[100%]'}
                      `}
                      key={category.slug}
                      onClick={() => setActiveCategory(category.slug)}
                    >
                      {category.title}
                    </div>
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

            {
              blogCategories.map(category => {
                return (
                  <div className="mb-10" key={category.slug}>
                    <div className="text-xl text-[#191919] leading-none font-bold uppercase border-l-4 border-[#83e214] pl-3 mb-4">{category.title}</div>
                    <div className="flex flex-wrap">
                      {
                        blogTags.map(tag => {
                          return (
                            <div
                              className={`
                                text-[13px] rounded bg-[#f2f4f9] cursor-pointer transition
                                flex items-center justify-center text-center px-2 pt-1 pb-0.5 mr-2 mb-4
                                ${tag.slug === activeTag && 'bg-black text-white'}
                              `}
                              key={tag.slug}
                              onClick={() => setActiveTag(tag.slug)}
                            >
                              {tag.title}
                            </div>
                          )
                        })
                      }
                    </div>

                    <div className="space-y-4 mb-2">
                      {
                        blogs.slice(0, 3).map(item => {
                          return (
                            <BlogItem item={item} key={item.id} containerClass="lg:grid-cols-[192px_auto] pb-5" />
                          )
                        })
                      }
                    </div>

                    <Link
                      href=""
                      className="flex justify-center items-center text-[#153f17] font-semibold w-[181px] h-[43px] rounded-[30px] border border-[#83e214] hover:bg-[#ccefdc] transition mx-auto"
                    >
                      Xem tất cả
                    </Link>
                  </div>
                )
              })
            }
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Blog;
