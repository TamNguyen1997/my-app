"use client"

import { Card, CardBody, CardHeader, Divider } from "@nextui-org/react";
import { useEffect, useState } from "react";

import parser from "html-react-parser"

export default function PopularBlogs() {

  const [blogs, setBlogs] = useState([])

  useEffect(() => {
    fetch("/api/blogs").then(res => res.json()).then(setBlogs)
  }, [])

  return (
    <div className="bg-white mx-auto w-6/12">
      <div className="mx-auto lg:max-w-full">
        <div className=" grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-6">
          {
            blogs.map((blog) => {
              return <div key={blog.id} className="max-h-100px max-w-100px">
                <Card className="py-4">
                  <CardHeader className="pb-0 pt-2 px-4 flex-col items-start text-justify align-middle">
                    <p className="text-xl font-semibold">{blog.title}</p>
                  </CardHeader>
                  <Divider />
                  <CardBody className="overflow-visible py-2 truncate ...">
                    {parser(blog.content)}<p>ksjdfhkjshdfjkshdkfhksdhfkjsdhfjk</p>
                  </CardBody>
                </Card>
              </div>
            })
          }
        </div>
      </div>
    </div>
  )
}
