"use client";

import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@nextui-org/react";
import Image from "next/image";

const Header = () => {

  const [categories, setCategories] = useState([])

  useEffect(() => {
    const getCategories = () => {
      fetch('/api/categories/').then(async res => {
        setCategories(await res.json())
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
          />
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {
          categories.map((category, i) => {
            return <NavbarItem key={i}>
              <Link href={`/category/${category.id}`} className="text-gray-800 transition hover:text-gray-800/75 cursor-pointer">
                {category.name}
              </Link>
            </NavbarItem>
          })
        }
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem className="hidden lg:flex">
          <ShoppingBag ></ShoppingBag>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  </>)
};

export default Header;
