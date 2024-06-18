import { Listbox, ListboxItem } from "@nextui-org/react";
import Link from "next/link";

const Sidebar = () => {
  return (
    <div className="flex flex-col gap-2 w-1/6 border-r min-h-full p-2">
      <div className="border-small px-1 py-2 rounded-small border-default-200">
        <Listbox
          aria-label="Single selection example"
          variant="flat">
          <ListboxItem>
            <Link href="/admin/image">Gallery</Link>
          </ListboxItem>
          <ListboxItem>
            <Link href="/admin/category">Category</Link>
          </ListboxItem>
          <ListboxItem>
            <Link href="/admin/product">Sản phẩm</Link>
          </ListboxItem>
          <ListboxItem>
            <Link href="/admin/blog">Blog</Link>
          </ListboxItem>
        </Listbox>
      </div>
    </div>
  );
};

export default Sidebar;
