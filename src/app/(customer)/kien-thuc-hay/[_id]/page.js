import { BlogDetail } from "@/components/blog/BlogDetail"
import { notFound } from "next/navigation"
import { WEBSITE_SCHEMA, getWebPageSchema, getBreadcrumbSchema } from "@/lib/schema"

export const dynamic = "force-dynamic"; // Forces dynamic rendering
export const revalidate = 0;

export async function generateMetadata({ params }) {
  const res = await fetch(`${process.env.WORDPRESS_URL}/wp-json/wp/v2/posts/?slug=${params._id.trim()}&_embed`)
  if (!res.ok) {
    return {}
  }

  const blog = (await res.json())[0]
  return {
    title: blog?.yoast_head_json?.og_title,
    description: blog?.yoast_head_json?.og_description,
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_DOMAIN}/kien-thuc-hay/${params._id}`
    },
    openGraph: {
      title: blog?.yoast_head_json?.og_title,
      description: blog?.yoast_head_json?.og_description,
      url: `${process.env.NEXT_PUBLIC_DOMAIN}/kien-thuc-hay/${params._id}`,
      images: [
        {
          url: blog._embedded["wp:featuredmedia"]?.length ? blog._embedded["wp:featuredmedia"][0]["source_url"] : `${process.env.NEXT_PUBLIC_DOMAIN}/brand/sao-viet-fanpage.jpg`,
          alt: blog?.title?.rendered || 'Kiến thức hay',
        }
      ]
    }
  }
}

const Information = async ({ params }) => {
  const res = await fetch(`${process.env.WORDPRESS_URL}/wp-json/wp/v2/posts/?slug=${params._id}&_embed`)
  if (!res.ok) {
    notFound()
  }

  const blog = (await res.json())[0]
  if (!blog?.content) {
    notFound()
  }

  const relatedBlogRes = await fetch(`${process.env.WORDPRESS_URL}/wp-json/wp/v2/posts/?_embed&categories=${blog.categories?.join()}&exclude=${blog.id}&per_page=4&categories_exclude=${process.env.NEXT_PUBLIC_WORDPRESS_PRODUCT_CATEGORY_ID || ""}`)

  const jsonLdSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      WEBSITE_SCHEMA,
      getWebPageSchema(`kien-thuc-hay/${params._id}`, blog.title.rendered, blog.title.rendered,
        getBreadcrumbSchema([
          {
            name: 'Kiến thức hay', slug: 'kien-thuc-hay'
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
      <BlogDetail slug={params._id.toString()} category="INFORMATION" blog={blog} relatedBlogs={relatedBlogRes.ok && (await relatedBlogRes.json())} />
    </>
  )
};

export default Information;
