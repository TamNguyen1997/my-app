import { BlogDetail } from "@/components/blog/BlogDetail"
import { db } from '@/app/db';

export async function generateMetadata({ params }, parent) {
  const result = await db.blog.findFirst({ where: { slug: params.id } })
  return {
    title: result?.title,
    description: result?.description,
  }
}

const Information = ({ params }) => {
  return (
    <>
      <link rel="canonical" href={`${process.env.NEXT_PUBLIC_DOMAIN}/kien-thuc-hay/${params._id}`} />
      <BlogDetail slug={params._id.toString()} category="INFORMATION" />
    </>
  )
};

export default Information;
