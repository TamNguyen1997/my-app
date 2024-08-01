import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "@nextui-org/react";
import BlogCarousel from "./BlogCarousel";
import TopBlogs from "./TopBlogs";
import BlogItem from "./BlogItem";

const blogCategories = [
  {
    title: "Kiến thức hay",
    id: "INFORMATION",
    slug: "kien-thuc-hay",
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

const BlogOverview = ({ activeCategory, activeTag }) => {
  const [blogs, setBlogs] = useState([]);
  const [category, setCategory] = useState({});

  useEffect(() => {
    fetch(`/api/blogs?blogCategory=${activeCategory}&blogSubCategory=${activeTag || ""}&excludeSupport=true&active=true`).then(res => res.json()).then(json => {
      setBlogs(json)
      setCategory(blogCategories.find(item => item.id === activeCategory))
    })
  }, [activeCategory, activeTag])

  return (
    <>
      <link rel="canonical" href={`${process.env.NEXT_PUBLIC_DOMAIN}/${activeCategory === "INFORMATION" ? "blog" : "tin-tuc"}`} />
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
                      text-black
                        text-[17px] font-semibold cursor-pointer relative pb-2 
                        after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-[0px] 
                        after:bg-[#FFD400] after:h-[3px] after:transition-width
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
              <div className="text-xl text-[#191919] leading-none font-bold uppercase border-l-4 border-[#FFD400] pl-3 mb-4">{category.title}</div>
              <div className="flex flex-wrap">
                {
                  category.tags?.map(tag => {
                    return (
                      <Link
                        className={`
                        text-black
                                text-[13px] rounded bg-[#f2f4f9] cursor-pointer transition
                                flex items-center justify-center text-center px-2 pt-1 pb-0.5 mr-2 mb-4
                                ${tag.id === activeTag && 'bg-black text-white'}
                              `}
                        key={tag.id}
                        href={`/kien-thuc-hay/${tag.slug}`}
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
                className="flex justify-center items-center text-[#153f17] font-semibold w-[181px] h-[43px] rounded-[30px] border border-[#FFD400] hover:bg-[#ccefdc] transition mx-auto"
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

export default BlogOverview