import { BlogDetail } from "@/components/blog/BlogDetail"
import { db } from '@/app/db';

export async function generateMetadata({ params }) {
  const result = await db.blog.findFirst({ where: { slug: params._id } })
  return {
    title: result?.title,
    description: result?.description,
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