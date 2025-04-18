import { BlogDetail } from "@/components/blog/BlogDetail"
import { notFound } from "next/navigation"

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

  return (
    <BlogDetail slug={params._id.toString()} category="INFORMATION" blog={blog} relatedBlogs={relatedBlogRes.ok && (await relatedBlogRes.json())} />
  )
};

export default Information;
