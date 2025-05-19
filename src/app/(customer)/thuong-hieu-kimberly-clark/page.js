import BrandPage from "@/components/BrandPage";
import { WEBSITE_SCHEMA, ORGANIZATION_SCHEMA, getBreadcrumbSchema, getBrandSchema } from "@/lib/schema"

export const metadata = {
  title: 'Thương hiệu Kimberly Clark',
  description: 'Thương hiệu Kimberly Clark',
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

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
      />
      <BrandPage brand="thuong-hieu-kimberly-clark" bg="bg-[url(/brand/banner/1440_290_Banner_Kimberly.png)]" />
    </>
  )
}
