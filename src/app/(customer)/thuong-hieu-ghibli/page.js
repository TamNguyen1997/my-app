import BrandPage from "@/components/BrandPage";
import { WEBSITE_SCHEMA, ORGANIZATION_SCHEMA, getBreadcrumbSchema, getBrandSchema } from "@/lib/schema"

export const metadata = {
  title: 'Thương hiệu Ghibli',
  description: 'Thương hiệu Ghibli',
}

const jsonLdSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    WEBSITE_SCHEMA,
    ORGANIZATION_SCHEMA,
    getBreadcrumbSchema([
      {
        name: 'Thương hiệu Ghibli', slug: 'thuong-hieu-ghibli'
      }
    ]),
    getBrandSchema({
      name: 'Thương hiệu Ghibli', slug: 'thuong-hieu-ghibli'
    })
  ]
}

export default async function Page() {
  const brand = await db.brand.findFirst({
    where: {
      slug: "thuong-hieu-ghibli"
    }
  })

  if (!brand) {
    notFound()
  }

  const filters = await db.filter.findMany({
    where: {
      active: true,
      filterValue: {
        some: {
          brand_on_filter_value: {
            some: {
              brandId: brand.id
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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
      />
      <BrandPage brand="thuong-hieu-ghibli" bg="bg-[url(/brand/banner/1440_290_Banner_Cate_Ghibli.png)]" filters={filters} />
    </>
  )
}
