import ProductDetail from "@/app/components/product/ProductDetail";
import SubCategory from "@/app/components/product/SubCategory";
import Category from "@/app/components/product/Category";
import CategoryNotFound from "@/app/components/CategoryNotFound";
import { db } from '@/app/db';
import { cate_type } from "@prisma/client";

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

const Page = async ({ params }) => {
  if (params.slug.length === 1) {
    const [slug, filter] = params.slug[0].split("#")
    const category = await db.category.findFirst({ where: { slug: slug }, include: { subcates: true, image: true } })

    if (!category) {
      return <CategoryNotFound />
    }
    if (category?.type === cate_type.SUB_CATE) {
      return <SubCategory params={slug} productFilter={filter} />
    }
    const subcates = await db.category.findMany({
      where: {
        AND: [
          { cateId: category.id },
          { product: { some: {} } }
        ]
      }
    })
    return <Category category={category} productFilter={filter} subcates={subcates} />
  }
  return <ProductDetail id={params.slug[1]} />
}

export default Page;