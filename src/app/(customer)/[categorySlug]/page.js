import SubCategory from "@/app/components/product/SubCategory";
import Category from "@/app/components/product/Category";
import CategoryNotFound from "@/app/components/CategoryNotFound";
import { db } from '@/app/db';
import { cate_type } from "@prisma/client";

import { WEBSITE_SCHEMA, ORGANIZATION_SCHEMA, getBreadcrumbSchema } from "@/lib/schema"

export async function generateMetadata({ params }) {
  const [slug] = params.categorySlug.split("_")
  const category = await db.category.findFirst({ where: { slug: slug } })
  return {
    title: category?.name,
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_DOMAIN}/${slug}`,
    },
  }
}

const jsonLdSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    WEBSITE_SCHEMA,
    ORGANIZATION_SCHEMA
  ]
};

const Page = async ({ params }) => {
  const [slug, filter] = params.categorySlug.split("#")
  const category = await db.category.findFirst({ where: { slug: slug }, include: { subcates: true, image: true } })

  if (!category) {
    return <CategoryNotFound />
  }

  const categoryBreadCrumbSchema = getBreadcrumbSchema([
    { name: category.name, slug: category.slug },
  ])

  let schema = { ...jsonLdSchema }
  schema['@graph'].push(categoryBreadCrumbSchema)

  return <>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
    {
      category?.type === cate_type.SUB_CATE ? <SubCategory params={slug} productFilter={filter} /> : <Category category={category} productFilter={filter} subcates={category.subcates} />
    }
  </>

}

export default Page;