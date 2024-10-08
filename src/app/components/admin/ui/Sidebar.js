"use client";

import { LOGIN_MESSAGE } from "@/constants/message";
import {
  ArrowRightLeft,
  Contact,
  Filter,
  History,
  HomeIcon,
  Image,
  Info,
  Layers,
  LogOut,
  NotebookPen,
  ShoppingBasket,
  StickyNote,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const items = [
  {
    id: "homepage",
    name: "Homepage",
    icon: <HomeIcon />,
    link: "/",
  },
  {
    id: "gallery",
    name: "Gallery",
    icon: <Image />,
    link: "/admin/image",
  },
  {
    id: "product",
    name: "Sản phẩm",
    icon: <ShoppingBasket />,
    link: "/admin/product",
  },
  {
    id: "filter",
    name: "Filter",
    icon: <Filter />,
    link: "/admin/filter",
  },
  {
    id: "blog",
    name: "Blog",
    icon: <NotebookPen />,
    link: "/admin/blog",
  },
  {
    id: "support",
    name: "Hỗ trợ",
    icon: <Info />,
    link: "/admin/ho-tro",
  },
  {
    id: "contact-infor",
    name: "Thông tin liên hệ",
    icon: <Contact />,
    link: "/admin/contact-info",
  },
  {
    id: "category",
    name: "Category",
    icon: <Layers />,
    link: "/admin/category",
  },
  {
    id: "order",
    name: "Đơn hàng",
    icon: <StickyNote />,
    link: "/admin/order",
  },
  {
    id: "redirect",
    name: "Redirect",
    icon: <ArrowRightLeft />,
    link: "/admin/redirect",
  },
  {
    id: "history",
    name: "History",
    icon: <History />,
    link: "/admin/history",
  },
  {
    id: "user",
    name: "User",
    icon: <User />,
    link: "/admin/user",
  },
  {
    id: "logout",
    name: "Logout",
    icon: <LogOut />,
  },
];

export default () => {
  const router = useRouter();
  const handleLogout = async () => {
    toast.info(LOGIN_MESSAGE.LOGOUT_IN_PROGRESS);
    try {
      const res = await fetch(`/api/logout`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const result = await res.json();

      if (res.ok) {
        toast.success(result.message || LOGIN_MESSAGE.LOGOUT_SUCCESS);
        setTimeout(() => router.push("/login"));
      } else {
        toast.error(result.message || LOGIN_MESSAGE.LOGOUT_FAILED);
      }
    } catch (error) {
      toast.error(LOGIN_MESSAGE.LOGOUT_FAILED);
      console.error(error);
    }
  };

  return (
    <>
      <ToastContainer />
      <aside
        id="sidebar-multi-level-sidebar"
        className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0"
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
          <ul className="space-y-2 font-medium">
            {items.map((item) => {
              return (
                <li key={item.id}>
                  {item.id === "logout" ? (
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-500 group"
                    >
                      {item.icon}
                      <span className="ms-3">{item.name}</span>
                    </button>
                  ) : (
                    <a
                      href={item.link}
                      className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-500 group"
                    >
                      {item.icon}
                      <span className="ms-3">{item.name}</span>
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </aside>
    </>
  );
};
