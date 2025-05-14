import BrandPage from "@/components/BrandPage";
import { WEBSITE_SCHEMA, ORGANIZATION_SCHEMA, getBreadcrumbSchema, getBrandSchema } from "@/lib/schema"

export const metadata = {
  title: 'Thương hiệu Rubbermaid',
  description: 'Thương hiệu Rubbermaid',
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

export default function Page() {
  return (<>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
    />
    <BrandPage brand="thuong-hieu-rubbermaid" bg="bg-[url(/brand/banner/1440_290_Banner_RBM.png)]" />
  </>)
}
