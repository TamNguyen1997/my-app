import { BlogDetail } from "@/components/blog/BlogDetail"
import { notFound } from "next/navigation"

export async function generateMetadata({ params }) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wp/v2/posts/?slug=${params._id.trim()}&_embed`)
  if (!res.ok) {
    return {}
  }

  const blog = (await res.json())[0]
  return {
    title: blog?.yoast_head_json?.og_title,
    description: blog?.yoast_head_json?.og_description,
  }
}

const Information = async ({ params }) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wp/v2/posts/?slug=${params._id}&_embed`)
  if (!res.ok) {
    notFound()
  }

  const blog = (await res.json())[0]
  if (!blog?.content) {
    notFound()
  }

  return (
    <>
      <link rel="canonical" href={`${process.env.NEXT_PUBLIC_DOMAIN}/kien-thuc-hay/${params._id}`} />
      <BlogDetail slug={params._id.toString()} category="INFORMATION" blog={blog} />
    </>
  )
};

export default Information;
