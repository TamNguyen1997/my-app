"use client";

import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@nextui-org/react";
import Image from "next/image";

const Header = () => {
  const [categories, setCategories] = useState([])

  const [subCates, setSubCates] = useState([])
  useEffect(() => {
    const getCategories = () => {
      fetch('/api/categories/').then(async res => {
        setCategories(await res.json())
      })
      fetch('/api/sub-categories/').then(async res => {
        setSubCates(await res.json())
      })
    }
    getCategories()
  }, [])
  return (<>
    <Navbar className="bg-[#ffd300]">
      <NavbarBrand>
        <Image
          src="https://dungcuvesinhsaoviet.com/wp-content/uploads/2021/11/Asset-2.png"
          alt="favicon"
          width="78"
          height="30"
          className="bg-black"
          onClick={() => window.location.replace("/")}
        />
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {
          categories.map((category, i) => {
            return <NavbarItem key={i}>
              <HoverDropDown category={category} subCates={subCates}></HoverDropDown>
            </NavbarItem>
          })
        }
        <NavbarItem>
          <Link href="/blog"
           className="text-gray-800 transition hover:text-gray-800/75 cursor-pointer">Tin tức</Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem className="hidden lg:flex">
          <ShoppingBag ></ShoppingBag>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  </>)
};

const HoverDropDown = ({ category, subCates }) => {
  const [isOpen, setIsOpen] = useState(false)
  return (<>
    <Dropdown isOpen={isOpen}>
      <DropdownTrigger>
        <Link href={`/category/${category.id}`}
          className="text-gray-800 transition hover:text-gray-800/75 cursor-pointer"
          onMouseOver={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}>
          {category.name}
        </Link>
      </DropdownTrigger>
      <DropdownMenu aria-label="Static Actions" onMouseOver={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
        {
          subCates.filter(item => item.categoryId === category.id).map(item =>
            <DropdownItem key={item.id} textValue="temp" onClick={() => window.location.replace(`/category/${category.id}/${item.id}`)}>
              {item.name} 
            </DropdownItem>
          )
        }
      </DropdownMenu>
    </Dropdown>
  </>)
}

export default Header;
