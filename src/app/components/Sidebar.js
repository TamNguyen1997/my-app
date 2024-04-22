import { Listbox, ListboxItem } from "@nextui-org/react";
import Link from "next/link";

const Sidebar = () => {
  const menu = [
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
      link: "/admin/blog",
      name: "Blog"
    }
  ]

  return (
    <div className="flex flex-col gap-2 w-1/6 border-r min-h-full p-2">
      <div className="border-small px-1 py-2 rounded-small border-default-200">
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
  );
};

export default Sidebar;
