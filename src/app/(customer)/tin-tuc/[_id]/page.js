import { BlogDetail } from "@/components/blog/BlogDetail"

export async function generateMetadata({ params }) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wp/v2/posts/?slug=${params._id}&_embed&categories_exclude=${process.env.NEXT_PUBLIC_WORDPRESS_PRODUCT_CATEGORY_ID}`)
  if (!res.ok) {
    return {}
  }

  const blog = (await res.json())[0]
  return {
    title: blog?.yoast_head_json?.og_title,
    description: blog?.yoast_head_json?.og_description,
  }
}

const News = ({ params }) => {
  return (
    <>
      <link rel="canonical" href={`${process.env.NEXT_PUBLIC_DOMAIN}/tin-tuc/${params._id}`} />
      <BlogDetail slug={params._id.toString()} category="NEWS" />
    </>
  )
};

export default News;