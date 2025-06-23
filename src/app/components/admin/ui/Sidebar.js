"use client";

import { LOGIN_MESSAGE } from "@/constants/message";
import {
  ArrowRightLeft,
  ClipboardList,
  Contact,
  Filter,
  Goal,
  History,
  Image,
  Info,
  Layers,
  LogOut,
  NotebookPen,
  ShoppingBasket,
  StickyNote,
  User,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";
import { user_role } from "@prisma/client";
import { useEffect, useState } from "react";

const items = [
  {
    id: "gallery",
    name: "Gallery",
    icon: <Image />,
    link: "/admin/image",
    roles: [user_role.MANAGER, user_role.ADMIN],
  },
  {
    id: "product",
    name: "Sản phẩm",
    icon: <ShoppingBasket />,
    link: "/admin/product",
    roles: [user_role.MANAGER, user_role.ADMIN],
  },
  {
    id: "promotion_program",
    name: "Chương trình khuyến mãi",
    icon: <Goal />,
    link: "/admin/promotion",
    roles: [user_role.MANAGER, user_role.ADMIN],
  },
  {
    id: "filter",
    name: "Filter",
    icon: <Filter />,
    link: "/admin/filter",
    roles: [user_role.MANAGER, user_role.ADMIN],
  },
  {
    id: "blog",
    name: "Blog",
    icon: <NotebookPen />,
    link: `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-admin/edit.php`,
    roles: [user_role.MANAGER, user_role.ADMIN],
  },
  {
    id: "support",
    name: "Hỗ trợ",
    icon: <Info />,
    link: "/admin/ho-tro",
    roles: [user_role.MANAGER, user_role.ADMIN],
  },
  {
    id: "contact-infor",
    name: "Thông tin liên hệ",
    icon: <Contact />,
    link: "/admin/contact-info",
    roles: [user_role.MANAGER, user_role.ADMIN],
  },
  {
    id: "category",
    name: "Category",
    icon: <Layers />,
    link: "/admin/category",
    roles: [user_role.MANAGER, user_role.ADMIN],
  },
  {
    id: "brand",
    name: "Thương hiệu",
    icon: <ClipboardList />,
    link: "/admin/brand",
    roles: [user_role.MANAGER, user_role.ADMIN],
  },
  {
    id: "order",
    name: "Đơn hàng",
    icon: <StickyNote />,
    link: "/admin/order",
    roles: [user_role.MANAGER, user_role.ADMIN],
  },
  {
    id: "redirect",
    name: "Redirect",
    icon: <ArrowRightLeft />,
    link: "/admin/redirect",
    roles: [user_role.MANAGER, user_role.ADMIN],
  },
  {
    id: "history",
    name: "Import/Export",
    icon: <History />,
    link: "/admin/history",
    roles: [user_role.MANAGER, user_role.ADMIN],
  },
  {
    id: "user",
    name: "User",
    icon: <User />,
    link: "/admin/user",
    roles: [user_role.ADMIN],
  },
  {
    id: "logout",
    name: "Logout",
    icon: <LogOut />,
    roles: [user_role.MANAGER, user_role.ADMIN],
  },
];

export default () => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  if (!isMounted) return null;

  const router = useRouter();
  const role = Cookies.get("role");

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
        className="fixed top-0 left-0 z-40 w-52 h-screen transition-transform -translate-x-full sm:translate-x-0"
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
          <ul className="space-y-2 font-medium">
            {items.map((item) => {
              if (!item.roles.includes(role)) {
                return <li key={item.id}></li>;
              }
              return (
                <li
                  key={item.id}
                  className={`${usePathname() === item.link
                    ? "bg-gray-300 rounded-lg"
                    : "hover:bg-gray-300 hover:rounded-lg"
                    }`}
                >
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
