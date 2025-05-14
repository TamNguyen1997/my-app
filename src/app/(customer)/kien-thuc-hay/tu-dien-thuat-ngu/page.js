import BlogOverview from "@/components/blog/BlogOverview"
import { WEBSITE_SCHEMA, getBreadcrumbSchema, getWebPageSchema } from "@/lib/schema"

const jsonLdSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    WEBSITE_SCHEMA,
    getWebPageSchema('kien-thuc-hay/tu-van-chon-mua', 'Từ điển thuật ngữ', 'Từ điển thuật ngữ',
      getBreadcrumbSchema([
        {
          name: 'Kiến thức hay', slug: 'kien-thuc-hay'
        },
        {
          name: 'Từ điển thuật ngữ', slug: 'tu-dien-thuat-ngu'
        }
      ]))
  ]
}

export const metadata = {
  title: 'Từ điển thuật ngữ',
  description: 'Từ điển thuật ngữ',
}

export default () => {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
      />
      <BlogOverview activeCategory="INFORMATION" activeTag="TERMINOLOGY" />
    </>
  )
};
