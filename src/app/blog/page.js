"use client";

import { Button, Card, CardBody, CardHeader, Divider, Image } from "@nextui-org/react";
import { useEffect, useState } from "react";

const Blog = () => {
  const [blogs, setBlogs] = useState([])

  useEffect(() => {
    fetch("/api/blogs").then(res => res.json()).then(setBlogs)
  }, [])

  if (blogs.length === 0) return <></>
  return (
    <>
      <div className="grid grid-cols-12 mx-auto w-4/5">
        <div className="col-span-2">
          Bài viết mới
          <div className="p-3">
            <div className="mx-auto lg:max-w-full">

              {
                blogs.map((blog) => {
                  return <div key={blog.id} className="grid grid-cols-4 p-2 border">
                    <div>
                      <Image
                        width={100}
                        height={50}
                        src={blog.thumbnail}
                      />
                    </div>
                    <div className="col-span-3 font-bold">
                      {blog.title}
                    </div>
                  </div>
                })
              }

            </div>
          </div>
        </div>
        <div className="p-3 mx-auto col-span-10">
          <div className="mx-auto lg:max-w-full">
            <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-6">
              {
                blogs.map((blog) => {
                  return <div key={blog.id}>
                    <Card className="py-4 top-0">
                      <CardHeader className="flex flex-col items-center justify-center h-64">
                        <Image
                          width={400}
                          height={200}
                          src={blog.thumbnail}
                        />
                      </CardHeader>
                      <Divider />
                      <CardBody className="h-32 w-full font-bold">
                        {blog.title}
                      </CardBody>
                    </Card>
                  </div>
                })
              }
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Blog;
