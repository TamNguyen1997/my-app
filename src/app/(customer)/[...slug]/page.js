import ProductDetail from "@/app/components/product/ProductDetail";
import SubCategory from "@/app/components/product/SubCategory";
import Category from "@/app/components/product/Category";
import CategoryNotFound from "@/app/components/CategoryNotFound";
import { db } from '@/app/db';
import { cate_type } from "@prisma/client";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  if (params.slug.length === 1) {
    const [slug] = params.slug[0].split("_")
    const category = await db.category.findFirst({ where: { slug: slug } })
    return {
      title: category?.name,
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_DOMAIN}/${slug}/`,
      },
    }
  }

  const product = await db.product.findFirst({ where: { slug: params.slug[1] } })
  return {
    title: product?.metaTitle,
    description: product?.metaDescription,
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_DOMAIN}/${params.slug[0]}/${params.slug[1]}`,
    },
  }
}

const Page = async ({ params }) => {
  if (params.slug.length === 1) {
    const [slug, filter] = params.slug[0].split("#")
    const category = await db.category.findFirst({ where: { slug: slug }, include: { subcates: true, image: true } })

    if (!category) {
      notFound()
    }
    if (category?.type === cate_type.SUB_CATE) {
      return <SubCategory params={slug} productFilter={filter} />
    }
    return <Category category={category} productFilter={filter} />
  }

  if (!await db.product.findFirst({ where: { slug: params.slug[1] } })) {
    notFound()
  }
  return <ProductDetail id={params.slug[1]} />
}

export default Page;