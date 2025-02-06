"use client"

import { Card, CardBody, CardHeader, Divider, Image, Spinner } from "@nextui-org/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import Carousel from "react-multi-carousel"
import "react-multi-carousel/lib/styles.css"
import { motion } from "framer-motion";
import parse from 'html-react-parser';

const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 3000 },
    items: 4
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1
  }
}

export default function PopularBlogs() {

  const [blogs, setBlogs] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wp/v2/posts/?per_page=10&page=1&_embed`)
      .then(res => res.json()).then(json => setBlogs(json))
      .then(() => setIsLoading(false))
  }, [])

  if (isLoading) return <Spinner className="w-full h-full m-auto p-12" />

  return (
    <motion.div
      initial={{ x: -200, opacity: 0 }}
      whileInView={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.7, delay: 0.3 }}
      viewport={{ once: true }}
      className="pb-[60px] m-auto sm:w-3/4 px-2">

      <div className="pb-2">
        <div className="bg-black rounded-tr-[50px] rounded-bl-[50px] flex items-center w-1/3 min-w-[222px] h-[50px] m-auto">
          <Link href="/" className="m-auto text-white font-bold text-xl">BÀI VIẾT NỔI BẬT</Link>
        </div>
      </div>

      <Carousel responsive={responsive} className="flex items-center pb-1" infinite>
        {
          blogs?.map((blog) => {
            return <div className="p-1" key={blog.id}>
              <Link href={`/tin-tuc/${blog.slug}`}>
                <div className="hover:-translate-y-2.5 hover:scale-[1.02] hover:shadow-[0px_10px_10px_rgba(0,0,0,0.15)] rounded-[20px] transition">
                  <Card>
                    <CardHeader className="flex flex-col items-center justify-center h-64">
                      <Image
                        height={256}
                        className="h-full w-full object-cover object-top"
                        src={`${blog._embedded["wp:featuredmedia"]?.length ? blog._embedded["wp:featuredmedia"][0]["source_url"] : "/default-featured-image.webp"}`}
                        alt="Thumbnail image"
                      />
                    </CardHeader>
                    <Divider />
                    <CardBody>
                      <div className="h-28 w-full font-bold">
                        <p className="line-clamp-3">
                          {parse(blog.title.rendered)}
                        </p>
                      </div>
                      <div className="w-full flex">
                        <div className="italic">
                          {new Date(blog.modified).toLocaleDateString("en-GB")}
                        </div>
                        <div className="text-sm text-[#6d6d6d] absolute right-2">
                          {blog.yoast_head_json?.author}
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </div>
              </Link>
            </div>
          })
        }
      </Carousel>

      <Link
        href="/tin-tuc"
        className="flex items-center w-1/3 min-w-[170px] h-[50px] m-auto rounded-large border-medium border-slate-950 hover:opacity-30">
        <span className="m-auto text-black">
          Xem tất cả tin tức
        </span>
      </Link>
    </motion.div>
  )
}
