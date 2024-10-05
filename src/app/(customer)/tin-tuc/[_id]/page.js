import { BlogDetail } from "@/components/blog/BlogDetail"
import { db } from '@/app/db';

export async function generateMetadata({ params }) {
  const result = await db.blog.findFirst({ where: { slug: params.id } })
  return {
    title: result?.title,
    description: result?.description,
  }
}

export async function Page({ params }) {
  return (
    <>
      <link rel="canonical" href={`${process.env.NEXT_PUBLIC_DOMAIN}/tin-tuc/${params._id}`} />
      <BlogDetail slug={params._id.toString()} category="NEWS" />
    </>
  )
};
