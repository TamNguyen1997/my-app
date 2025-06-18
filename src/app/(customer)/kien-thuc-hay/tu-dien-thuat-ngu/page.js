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
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_DOMAIN}/kien-thuc-hay/tu-dien-thuat-ngu`,
  },
  openGraph: {
    title: 'Từ điển thuật ngữ',
    description: 'Từ điển thuật ngữ',
    url: `${process.env.NEXT_PUBLIC_DOMAIN}/brand/sao-viet-fanpage.jpg`,
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_DOMAIN}/brand/sao-viet-fanpage.jpg`,
        alt: 'Từ điển thuật ngữ',
      }
    ]
  }
}

const Terminology = () => {
  return (
    <>z
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
      />
      <BlogOverview activeCategory="INFORMATION" activeTag="TERMINOLOGY" />
    </>
  )
};

export default Terminology;
