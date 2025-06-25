import BrandPage from "@/components/BrandPage";
import { WEBSITE_SCHEMA, ORGANIZATION_SCHEMA, getBreadcrumbSchema, getBrandSchema } from "@/lib/schema"
import { db } from "@/app/db"
import { notFound } from "next/navigation";

export const metadata = {
  title: 'Thương hiệu Rubbermaid',
  description: 'Thương hiệu Rubbermaid',
  openGraph: {
    title: 'Thương hiệu Rubbermaid',
    description: 'Thương hiệu Rubbermaid',
    url: `${process.env.NEXT_PUBLIC_DOMAIN}/thuong-hieu-rubbermaid`,
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_DOMAIN}/brand/banner/1440_290_Banner_RBM.png`,
        width: 1440,
        height: 290,
        alt: 'Thương hiệu Rubbermaid',
      }
    ]
  }
}

const jsonLdSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    WEBSITE_SCHEMA,
    ORGANIZATION_SCHEMA,
    getBreadcrumbSchema([
      {
        name: 'Thương hiệu Moerman', slug: 'thuong-hieu-moerman'
      }
    ]),
    getBrandSchema({
      name: 'Thương hiệu Moerman', slug: 'thuong-hieu-moerman'
    })
  ]
}

export default async function Page() {
  const brand = await db.brand.findFirst({ where: { slug: 'thuong-hieu-rubbermaid' } })
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
              brandId: brand.id,
            }
          },
          active: true
        }
      }
    },
    include: {
      filterValue: true
    }
  })

  return (<>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
    />
    <BrandPage brand="thuong-hieu-rubbermaid" bg="bg-[url(/brand/banner/1440_290_Banner_RBM.png)]" filters={filters.filter(item => item.filterValue.length > 0)} />
  </>)
}
