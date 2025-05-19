import BlogOverview from "@/components/blog/BlogOverview"
import { WEBSITE_SCHEMA, getBreadcrumbSchema, getWebPageSchema } from "@/lib/schema"

const jsonLdSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    WEBSITE_SCHEMA,
    getWebPageSchema('kien-thuc-hay/huong-dan-su-dung', 'Hướng dẫn sử dụng', 'Hướng dẫn sử dụng',
      getBreadcrumbSchema([
        {
          name: 'Kiến thức hay', slug: 'kien-thuc-hay'
        },
        {
          name: 'Hướng dẫn sử dụng', slug: 'huong-dan-su-dung'
        }
      ]))
  ]
}
export const metadata = {
  title: 'Hướng dẫn sử dụng',
  description: 'Hướng dẫn sử dụng',
}

const News = () => {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
      />
      <BlogOverview activeCategory="INFORMATION" activeTag="MANUAL" />
    </>
  )
};

export default News;
