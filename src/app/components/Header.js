import { Menu, Phone, Search, ShoppingCart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Input } from "@nextui-org/react";

const Header = () => {

  return (
    <nav className="bg-black border-gray-200 dark:bg-gray-900 h-[140px]">
      <div className="flex w-full h-full">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <Link href="/">
            <Image
              src="/favicon.svg"
              alt="favicon"
              width="78"
              height="30"
              className="bg-black h-[81px] w-[200px]"
            />
          </Link>
        </div>

        <div className="bg-[#ffd300] w-[75%] rounded-tl-[50px] rounded-bl-[50px]">
          <div className="pl-[50px] h-full">
            <div className="h-1/2 p-3 flex gap-7">
              <div className="w-[1/4] flex items-center gap-5">
                <Input
                  isClearable
                  radius="lg"
                  placeholder="Tìm sản phẩm..."
                  aria-label="Search"
                  startContent={
                    <Search className="hover:opacity-hover" strokeWidth={3}></Search>
                  }
                />
                <div className="bg-[#FFAC0A] w-[150px] h-[40px] items-center text-center relative flex gap-2 rounded-md shadow-md">
                  <span className="pl-1">
                    <ShoppingCart size={24} strokeWidth={2}></ShoppingCart>
                  </span>
                  <span className="text-sm">
                    Giỏ hàng
                  </span>
                </div>
              </div>
              <div className="flex items-center">
                <div className="flex gap-10 item">
                  <Link href="/">Tin tức</Link>
                  <Link href="/">Blog</Link>
                  <Link href="/">Liên hệ</Link>
                  <Link href="/">
                    <div className="flex gap-3">
                      <div>
                        <Phone></Phone>
                      </div>
                      <div className="text-lg font-bold">
                        090 380 2979
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
            <div className="h-1/2 flex items-center gap-5">
              <div className="flex gap-1 rounded-lg shadow-md w-[121px] h-[45px] items-center text-center font-bold">
                <span className="pl-1">
                  <Menu />
                </span>
                <span>
                  Danh mục
                </span>
              </div>
              <div className="flex gap-6 text-sm">
                <Link href="/">Dụng cụ vệ sinh</Link>
                <Link href="/">Xe đẩy</Link>
                <Link href="/">Dụng cụ vệ sinh kính</Link>
                <Link href="/">Găng tay</Link>
                <Link href="/">Xe làm vệ sinh</Link>
                <Link href="/">Máy chà sàn</Link>
                <Link href="/">Máy hút bụi</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
};

export default Header;
