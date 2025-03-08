import { BlogDetail } from "@/components/blog/BlogDetail"

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
  return (
    <>
      <link rel="canonical" href={`${process.env.NEXT_PUBLIC_DOMAIN}/kien-thuc-hay/${params._id}`} />
      <BlogDetail slug={params._id.toString()} category="INFORMATION" />
    </>
  )
};

export default Information;
