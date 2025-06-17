import { db } from '@/app/db';
import BrandPage from "@/components/BrandPage";
import { WEBSITE_SCHEMA, ORGANIZATION_SCHEMA, getBreadcrumbSchema, getBrandSchema } from "@/lib/schema"
import { notFound } from "next/navigation";

export const metadata = {
  title: 'Thương hiệu Moerman',
  description: 'Thương hiệu Moerman',
  openGraph: {
    title: 'Thương hiệu Moerman',
    description: 'Thương hiệu Moerman',
    url: `${process.env.NEXT_PUBLIC_DOMAIN}/brand/banner/1440_290_Banner_Cate_Mappa.png`,
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_DOMAIN}/brand/banner/1440_290_Banner_Cate_Moerman.png`,
        width: 1440,
        height: 290,
        alt: 'Thương hiệu Moerman', 
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
  const brand = await db.brand.findFirst({
    where: {
      slug: "thuong-hieu-moerman"
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
      <BrandPage brand="thuong-hieu-moerman" bg="bg-[url(/brand/banner/1440_290_Banner_Cate_Moerman.png)]" filters={filters} />
    </>
  )
}
