import ProductDetail from "@/app/components/product/ProductDetail";
import Category from "@/app/components/product/Category";
import { db } from '@/app/db';

export async function generateMetadata({ params }) {
  if (params.slug.length === 1) {
    const [slug] = params.slug[0].split("_")
    const category = await db.category.findFirst({ where: { slug: slug } })
    return {
      title: category?.name
    }
  }

  const product = await db.product.findFirst({ where: { slug: params.slug[1] } })
  return {
    title: product?.metaTitle,
    description: product?.metaDescription,
  }
}

export default function Page({ params }) {

  if (params.slug.length === 1) {
    const [slug, filter] = params.slug[0].split("#")
    return <Category params={slug} productFilter={filter} />
  }
  return <ProductDetail id={params.slug[1]} />
};
