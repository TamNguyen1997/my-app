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
    title: category?.metaTitle || category?.name,
    description: category?.metaDescription || category?.description,
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_DOMAIN}/${slug}`,
    },
    openGraph: {
      title: category?.metaTitle || category?.name,
      description: category?.metaDescription || category?.description,
      url: `${process.env.NEXT_PUBLIC_DOMAIN}/${category.slug}`,
      images: [
        {
          url: category?.imageUrl || `${process.env.NEXT_PUBLIC_DOMAIN}/default-category-image.png`,
          width: 1440,
          height: 290,
          alt: category?.name || 'Dụng cụ vệ sinh Sao Việt',
        }
      ]
    }
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

  const filters = await db.filter.findMany({
    where: {
      active: true,
      filterValue: {
        some: {
          category_on_filter_value: {
            some: {
              categoryId: category.id || ""
            }
          }
        }
      }
    },
    include: {
      filterValue: {
        where: {
          active: true
        }
      }
    }
  })

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
      category?.type === cate_type.SUB_CATE ?
        <SubCategory params={slug} productFilter={filter} filters={filters.filter(item => item.filterValue.length > 0)} /> :
        <Category category={category} productFilter={filter} subcates={category.subcates} filters={filters.filter(item => item.filterValue.length > 0)} />
    }
  </>

}

export default Page;