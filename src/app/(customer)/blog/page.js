"use client";

import { Link } from "@nextui-org/react";
import { useEffect, useState } from "react";
import BlogItem from "@/components/BlogItem";
import BlogCarousel from "@/components/BlogCarousel";
import TopBlogs from "@/components/TopBlogs";
import { motion } from "framer-motion";

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

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [activeCategory, setActiveCategory] = useState("INFORMATION");
  const [category, setCategory] = useState({
    title: "Kiến thức hay",
    id: "INFORMATION",
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
  });

  const [activeTag, setActiveTag] = useState("");

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
                    <div
                      className={`
                        text-[17px] font-semibold cursor-pointer relative pb-2 
                        after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-[0px] after:bg-[#ffd300] after:h-[3px] after:transition-width
                        ${category.id === activeCategory && 'after:!w-[100%]'}
                      `}
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
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

            <div className="mb-10" key={category.id}>
              <div className="text-xl text-[#191919] leading-none font-bold uppercase border-l-4 border-[#ffd300] pl-3 mb-4">{category.title}</div>
              <div className="flex flex-wrap">
                {
                  category.tags.map(tag => {
                    return (
                      <div
                        className={`
                                text-[13px] rounded bg-[#f2f4f9] cursor-pointer transition
                                flex items-center justify-center text-center px-2 pt-1 pb-0.5 mr-2 mb-4
                                ${tag.id === activeTag && 'bg-black text-white'}
                              `}
                        key={tag.id}
                        onClick={() => setActiveTag(tag.id)}
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
