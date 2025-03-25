import BlogOverview from "@/components/blog/BlogOverview"

export const metadata = {
  title: 'Kiến thức hay',
  description: 'Kiến thức hay',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_DOMAIN}/kien-thuc-hay`,
  },
}

const Information = () => {
  return (<>
    <BlogOverview activeCategory="INFORMATION" activeTag="" />
  </>)
};

export default Information;
