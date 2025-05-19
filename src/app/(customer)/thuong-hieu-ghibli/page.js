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

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
      />
      <BrandPage brand="thuong-hieu-ghibli" bg="bg-[url(/brand/banner/1440_290_Banner_Cate_Ghibli.png)]" />
    </>
  )
}
