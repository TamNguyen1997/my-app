import BlogOverview from "@/components/blog/BlogOverview"
import { WEBSITE_SCHEMA, getBreadcrumbSchema, getWebPageSchema } from "@/lib/schema"

const jsonLdSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    WEBSITE_SCHEMA,
    getWebPageSchema('kien-thuc-hay/tu-van-chon-mua', 'Tư vấn chọn mua', 'Tư vấn chọn mua',
      getBreadcrumbSchema([
        {
          name: 'Kiến thức hay', slug: 'kien-thuc-hay'
        },
        {
          name: 'Tư vấn chọn mua', slug: 'tu-van-chon-mua'
        }
      ]))
  ]
}

export const metadata = {
  title: 'Tư vấn chọn mua',
  description: 'Tư vấn chọn mua',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_DOMAIN}/kien-thuc-hay/tu-van-chon-mua`,
  },
  openGraph: {
    title: 'Tư vấn chọn mua',
    description: 'Tư vấn chọn mua',
    url: `${process.env.NEXT_PUBLIC_DOMAIN}/kien-thuc-hay/tu-van-chon-mua`,
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_DOMAIN}/brand/sao-viet-fanpage.jpg`,
        alt: 'Tư vấn chọn mua',
      }
    ]
  }
}

const News = () => {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
      />
      <BlogOverview activeCategory="INFORMATION" activeTag="ADVISORY" />
    </>
  )
};

export default News;
