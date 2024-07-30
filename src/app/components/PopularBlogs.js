"use client"

import { Card, CardBody, CardHeader, Divider, Spinner } from "@nextui-org/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import Carousel from "react-multi-carousel"
import "react-multi-carousel/lib/styles.css"

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
    fetch("/api/blogs?excludeSupport=true&active=true").then(res => res.json()).then(setBlogs).then(() => setIsLoading(false))
  }, [])

  if (isLoading) return <Spinner className="m-auto" />

  return (
    <>
      <div className="pb-2">
        <div className="bg-black rounded-tr-[50px] rounded-bl-[50px] flex items-center w-1/3 h-[50px] m-auto">
          <Link href="/" className="m-auto text-white font-bold text-xl">BÀI VIẾT NỔI BẬT</Link>
        </div>
      </div>

      <Carousel responsive={responsive} className="flex items-center pb-1" infinite>
        {
          blogs?.map((blog) => {
            return <div className="p-1" key={blog.id}>
              <Link href={`/kien-thuc-hay/${blog.slug}`}>
                <div className="hover:-translate-y-2.5 hover:scale-[1.02] hover:shadow-[0px_10px_10px_rgba(0,0,0,0.15)] rounded-[20px] transition">
                  <Card>
                    <CardHeader className="flex flex-col items-center justify-center h-64">
                      <img
                        className="h-full w-full object-cover object-top"
                        src={`${process.env.NEXT_PUBLIC_FILE_PATH + blog.thumbnail}`}
                        alt="Thumbnail image"
                      />
                    </CardHeader>
                    <Divider />
                    <CardBody>
                      <div className="h-28 w-full font-bold">
                        <p className="line-clamp-3">
                          {blog.title}
                        </p>
                      </div>
                      <div className="w-full flex">
                        <div className="italic">
                          {new Date(blog.updatedAt).toLocaleDateString("en-GB")}
                        </div>
                        <div className="text-sm text-[#6d6d6d] absolute right-2">
                          {blog.author}
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
        href="/kien-thuc-hay"
        className="flex items-center w-1/3 h-[50px] m-auto rounded-large border-medium border-slate-950 hover:opacity-30">
        <span className="m-auto text-black">
          Xem tất cả tin tức
        </span>
      </Link>
    </>
  )
}
