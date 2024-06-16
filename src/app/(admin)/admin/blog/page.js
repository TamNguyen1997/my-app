"use client"

import { Listbox, ListboxItem } from "@nextui-org/react";
import Link from "next/link";
import BlogCms from "@/components/admin/BlogCms"

const menu = [
  {
    id: "image",
    link: "/admin/image",
    name: "Gallery"
  },
  {
    id: "category",
    link: "/admin/category",
    name: "Category"
  },
  {
    id: "product",
    link: "/admin/product",
    name: "Sản phẩm"
  },
  {
    id: "blog",
    link: "/admin/blog",
    name: "Blog"
  }
]

const Admin = () => {
  return (
    <div>
      <div className="flex justify-between">
        <div className="flex flex-col gap-2 w-1/6 border-r min-h-screen p-2">
          <div className="border-small px-1 py-2 rounded-small border-default-200 shadow-md">
            <Listbox
              aria-label="Single selection example"
              variant="flat">
              {
                menu.map(item => {
                  return <ListboxItem key={item.id}>
                    <Link href={item.link}>{item.name}</Link>
                  </ListboxItem>
                })
              }
            </Listbox>
          </div>
        </div>
        <div className="pl-5 w-5/6 pr-5">
          <div className="border rounded-md shadow-md">
            <BlogCms></BlogCms>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
