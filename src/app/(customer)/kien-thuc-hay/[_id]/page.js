import { BlogDetail } from "@/components/blog/BlogDetail"

const Information = ({ params }) => {
  return (
    <>
      <link rel="canonical" href={`${process.env.NEXT_PUBLIC_DOMAIN}/kien-thuc-hay/${params._id}`} />
      <BlogDetail slug={params._id.toString()} category="INFORMATION" />
    </>
  )
};

export default Information;
