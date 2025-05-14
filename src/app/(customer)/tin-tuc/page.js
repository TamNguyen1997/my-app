import BlogOverview from "@/components/blog/BlogOverview"
import { WEBSITE_SCHEMA, getBreadcrumbSchema, getWebPageSchema } from "@/lib/schema"

const jsonLdSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    WEBSITE_SCHEMA,
    getWebPageSchema('tin-tuc', 'Tin tức', 'Tin tức',
      getBreadcrumbSchema([
        {
          name: 'Tin tức', slug: 'tin-tuc'
        }
      ]))
  ]
}

export const metadata = {
  title: 'Tin tức',
  description: 'Tin tức',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_DOMAIN}/tin-tuc`,
  },
}

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
      />
      <BlogOverview activeCategory="NEWS" activeTag="" />
    </>
  )
};
