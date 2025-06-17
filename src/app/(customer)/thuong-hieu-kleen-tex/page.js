import { db } from '@/app/db';
import BrandPage from "@/components/BrandPage";
import { WEBSITE_SCHEMA, ORGANIZATION_SCHEMA, getBreadcrumbSchema, getBrandSchema } from "@/lib/schema"

export const metadata = {
  title: 'Thương hiệu Kleen-Tex',
  description: 'Thương hiệu Kleen-Tex',
  openGraph: {
    title: 'Thương hiệu Kleen-Tex',
    description: 'Thương hiệu Kleen-Tex',
    url: `${process.env.NEXT_PUBLIC_DOMAIN}/thuong-hieu-kleen-tex`,
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_DOMAIN}/brand/banner/1440_290_Banner_Cate_Kleen_tex.png`,
        width: 1440,
        height: 290,
        alt: 'Thương hiệu Kleen-Tex',
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
        name: 'Thương hiệu Kleen-Tex', slug: 'thuong-hieu-kleen-tex'
      }
    ]),
    getBrandSchema({
      name: 'Thương hiệu Kleen-Tex', slug: 'thuong-hieu-kleen-tex'
    })
  ]
}

export default async function Page() {
  const brand = await db.brand.findFirst({
    where: {
      slug: "thuong-hieu-kleen-tex"
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

  return (<>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
    />
    <BrandPage brand="thuong-hieu-kleen-tex" bg="bg-[url(/brand/banner/1440_290_Banner_Cate_Kleen_tex.png)]" filters={filters} />
  </>)
}
