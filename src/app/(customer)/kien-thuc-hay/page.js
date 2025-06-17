import BlogOverview from "@/components/blog/BlogOverview"
import { WEBSITE_SCHEMA, getBreadcrumbSchema, getWebPageSchema } from "@/lib/schema"

const jsonLdSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    WEBSITE_SCHEMA,
    getWebPageSchema('kien-thuc-hay', 'Kiến thức hay', 'Kiến thức hay',
      getBreadcrumbSchema([
        {
          name: 'Kiến thức hay', slug: 'kien-thuc-hay'
        }
      ]))
  ]
}

export const metadata = {
  title: 'Kiến thức hay',
  description: 'Kiến thức hay',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_DOMAIN}/kien-thuc-hay`,
  },
  openGraph: {
    title: 'Kiến thức hay',
    description: 'Kiến thức hay',
    url: `${process.env.NEXT_PUBLIC_DOMAIN}/kien-thuc-hay`,
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_DOMAIN}/brand/sao-viet-fanpage.jpg`,
        alt: 'Kiến thức hay',
      }
    ]
  }
}

const Information = () => {
  return (<>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
    />
    <BlogOverview activeCategory="INFORMATION" activeTag="" />
  </>)
};

export default Information;
