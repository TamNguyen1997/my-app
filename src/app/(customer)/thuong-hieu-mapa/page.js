import BrandPage from "@/components/BrandPage";
import { WEBSITE_SCHEMA, ORGANIZATION_SCHEMA, getBreadcrumbSchema, getBrandSchema } from "@/lib/schema"

export const metadata = {
  title: 'Thương hiệu Mapa',
  description: 'Thương hiệu Mapa',
}

const jsonLdSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    WEBSITE_SCHEMA,
    ORGANIZATION_SCHEMA,
    getBreadcrumbSchema([
      {
        name: 'Thương hiệu Mapa', slug: 'thuong-hieu-mapa'
      }
    ]),
    getBrandSchema({
      name: 'Thương hiệu Mapa', slug: 'thuong-hieu-mapa'
    })
  ]
}

export default function Page() {
  return (<>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
    />
    <BrandPage brand="thuong-hieu-mapa" bg="bg-[url(/brand/banner/1440_290_Banner_Cate_Mappa.png)]" />
  </>)
}
