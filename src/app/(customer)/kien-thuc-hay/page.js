import BlogOverview from "@/components/blog/BlogOverview"

export const metadata = {
  title: 'Kiến thức hay',
  description: 'Kiến thức hay',
}

const Information = () => {
  return (<>
    <link rel="canonical" href={`${process.env.NEXT_PUBLIC_DOMAIN}/kien-thuc-hay`} />
    <BlogOverview activeCategory="INFORMATION" activeTag="" />
  </>)
};

export default Information;
