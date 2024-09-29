"use client";

import { useParams } from "next/navigation";
import ProductDetail from "@/app/components/product/ProductDetail";
import Category from "@/app/components/product/Category";

const Cate = () => {
  const params = useParams();

  if (params.slug.length === 1) {
    const [slug, filter] = params.slug[0].split("_")
    return <Category params={slug} productFilter={filter} />
  }
  return <ProductDetail id={params.slug[1]} />
};


export default Cate;
