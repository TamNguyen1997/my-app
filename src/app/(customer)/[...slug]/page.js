"use client";

import { useParams, usePathname } from "next/navigation";
import ProductDetail from "@/app/components/product/ProductDetail";
import Category from "@/app/components/product/Category";
import { useEffect } from "react";

const Cate = () => {
  const params = useParams();
  const pathname = usePathname()

  useEffect(() => {
    const redirect = async () => {
      await fetch(`/api/redirects/redirect?from=${encodeURIComponent(pathname)}`, { method: "OPTIONS" }).then(res => {
        console.log(res.status)
        if (res.status === 301 || res.status === 302) {
          window.location.replace(res.headers.get('X-Custom-Header'))
        }
      })
    }

    redirect()
  }, [])

  if (params.slug.length === 1) {
    const [slug, filter] = params.slug[0].split("_")
    return <Category params={slug} productFilter={filter} />
  }
  return <ProductDetail id={params.slug[1]} />
};


export default Cate;
