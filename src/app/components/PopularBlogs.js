"use client"

import { Card, CardBody, CardHeader, Divider, Image } from "@nextui-org/react";
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
    items: 4
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 3
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 2
  }
}

export default function PopularBlogs() {

  const [blogs, setBlogs] = useState([])

  useEffect(() => {
    fetch("/api/blogs").then(res => res.json()).then(setBlogs)
  }, [])

  if (blogs.length === 0) return <></>

  return (
    <>
      <div className="pb-3">
        <div className="bg-black rounded-tr-[50px] rounded-bl-[50px] flex items-center w-1/3 h-[50px] m-auto">
          <Link href="/" className="m-auto text-white font-bold text-xl">BÀI VIẾT NỔI BẬT</Link>
        </div>
      </div>

      <Carousel responsive={responsive} className="flex items-center m-auto w-3/4" infinite>
        {
          blogs.map((blog) => {
            return <div className="p-1">
              <Link key={blog.id} href={`/blog/${blog.id}`}>
                <div>
                  <Card>
                    <CardHeader className="flex flex-col items-center justify-center h-64">
                      <Image
                        width={400}
                        height={200}
                        className="h-[250px] w-[300px]"
                        src={blog.thumbnail}
                      />
                    </CardHeader>
                    <Divider />
                    <CardBody className="h-28 w-full font-bold">
                      {blog.title}
                    </CardBody>
                  </Card>
                </div>
              </Link>
            </div>
          })
        }
      </Carousel>
    </>
  )
}
