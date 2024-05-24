"use client"

import { Card, CardBody, CardHeader, Divider, Image } from "@nextui-org/react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function PopularBlogs() {

  const [blogs, setBlogs] = useState([])

  useEffect(() => {
    fetch("/api/blogs").then(res => res.json()).then(setBlogs)
  }, [])

  if (blogs.length === 0) return <></>

  return (
    <>
      <div className="text-2xl font-bold text-center mb-5">
        Bài viết nổi bật
      </div>
      <div className="mx-auto w-4/5 pb-3">
        <div className="mx-auto lg:max-w-full">
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-6">
            {
              blogs.map((blog) => {
                return <Link key={blog.id} href={`/blog/${blog.id}`}>
                  <div>
                    <Card className="py-4 top-0">
                      <CardHeader className="flex flex-col items-center justify-center h-64">
                        <Image
                          width={400}
                          height={200}
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
              })
            }
          </div>
        </div>
      </div>
    </>
  )
}
