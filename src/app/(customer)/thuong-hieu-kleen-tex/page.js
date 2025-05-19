import BrandPage from "@/components/BrandPage";
import { WEBSITE_SCHEMA, ORGANIZATION_SCHEMA, getBreadcrumbSchema, getBrandSchema } from "@/lib/schema"

export const metadata = {
  title: 'Thương hiệu Kleen-Tex',
  description: 'Thương hiệu Kleen-Tex',
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

export default function Page() {
  return (<>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
    />
    <BrandPage brand="thuong-hieu-kleen-tex" bg="bg-[url(/brand/banner/1440_290_Banner_Cate_Kleen_tex.png)]" />
  </>)
}
