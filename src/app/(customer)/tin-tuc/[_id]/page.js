import { BlogDetail } from "@/components/blog/BlogDetail"


const News = ({ params }) => {
  return (
    <>
      <link rel="canonical" href={`${process.env.NEXT_PUBLIC_DOMAIN}/tin-tuc/${params._id}`} />
      <BlogDetail slug={params._id.toString()} category="NEWS" />
    </>
  )
};

export default News;