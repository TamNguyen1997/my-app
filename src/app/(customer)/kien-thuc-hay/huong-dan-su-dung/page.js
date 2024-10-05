import BlogOverview from "@/components/blog/BlogOverview"

export const metadata = {
  title: 'Hướng dẫn sử dụng',
  description: 'Hướng dẫn sử dụng',
}

const News = () => {
  return (
    <>
      <link rel="canonical" href={`${process.env.NEXT_PUBLIC_DOMAIN}/kien-thuc-hay/huong-dan-su-dung`} />
      <BlogOverview activeCategory="INFORMATION" activeTag="MANUAL" />
    </>
  )
};

export default News;
