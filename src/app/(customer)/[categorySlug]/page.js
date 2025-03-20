import SubCategory from "@/app/components/product/SubCategory";
import Category from "@/app/components/product/Category";
import CategoryNotFound from "@/app/components/CategoryNotFound";
import { db } from '@/app/db';
import { cate_type } from "@prisma/client";

export async function generateMetadata({ params }) {
  const [slug] = params.categorySlug.split("_")
  const category = await db.category.findFirst({ where: { slug: slug } })
  return {
    title: category?.name,
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_DOMAIN}/${slug}/`,
    },
  }
}

const Page = async ({ params }) => {
  const [slug, filter] = params.categorySlug.split("#")
  const category = await db.category.findFirst({ where: { slug: slug }, include: { subcates: true, image: true } })

  if (!category) {
    return <CategoryNotFound />
  }
  if (category?.type === cate_type.SUB_CATE) {
    return <SubCategory params={slug} productFilter={filter} />
  }
  return <Category category={category} productFilter={filter} />
}

export default Page;