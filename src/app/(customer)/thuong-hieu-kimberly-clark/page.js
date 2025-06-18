import { db } from '@/app/db';
import BrandPage from "@/components/BrandPage";
import { WEBSITE_SCHEMA, ORGANIZATION_SCHEMA, getBreadcrumbSchema, getBrandSchema } from "@/lib/schema"

export const metadata = {
  title: 'Thương hiệu Kimberly Clark',
  description: 'Thương hiệu Kimberly Clark',
  openGraph: {
    title: 'Thương hiệu Kimberly Clark',
    description: 'Thương hiệu Kimberly Clark',
    url: `${process.env.NEXT_PUBLIC_DOMAIN}/brand/banner/1440_290_Banner_Kimberly.png`,
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_DOMAIN}/brand/banner/1440_290_Banner_Kimberly.png`,
        width: 1440,
        height: 290,
        alt: 'Thương hiệu Kimberly Clark',
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
        name: 'Thương hiệu Kimberly Clark', slug: 'thuong-hieu-kimberly-clark'
      }
    ]),
    getBrandSchema({
      name: 'Thương hiệu Kimberly Clark', slug: 'thuong-hieu-kimberly-clark'
    })
  ]
}

export default async function Page() {
  const brand = await db.brand.findFirst({
    where: {
      slug: "thuong-hieu-kimberly-clark"
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
      <BrandPage brand="thuong-hieu-kimberly-clark" bg="bg-[url(/brand/banner/1440_290_Banner_Kimberly.png)]" filters={filters} />
    </>
  )
}
