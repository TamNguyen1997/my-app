import { BlogDetail } from "@/components/blog/BlogDetail"
import { notFound } from "next/navigation"
import { WEBSITE_SCHEMA, getWebPageSchema, getBreadcrumbSchema } from "@/lib/schema"

export const dynamic = "force-dynamic"; // Forces dynamic rendering
export const revalidate = 0;

export async function generateMetadata({ params }) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wp/v2/posts/?slug=${params._id}&_embed`)
  if (!res.ok) {
    return {}
  }

  const blog = (await res.json())[0]
  return {
    title: blog?.yoast_head_json?.og_title,
    description: blog?.yoast_head_json?.og_description,
  }
}

const News = async ({ params }) => {
  const res = await fetch(`${process.env.WORDPRESS_URL}/wp-json/wp/v2/posts/?slug=${params._id}&_embed`)
  if (!res.ok) {
    notFound()
  }

  const blog = (await res.json())[0]
  if (!blog?.content) {
    notFound()
  }

  const jsonLdSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      WEBSITE_SCHEMA,
      getWebPageSchema(`tin-tuc/${params._id}`, blog.title.rendered, blog.title.rendered,
        getBreadcrumbSchema([
          {
            name: 'Tin tức', slug: 'tin-tuc'
          },
          {
            name: blog.title.rendered, slug: params._id
          }
        ]))
    ]
  }
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
      />
      <BlogDetail slug={params._id.toString()} category="NEWS" blog={blog} />
    </>
  )
};

export default News;