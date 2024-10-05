import BlogOverview from "@/components/blog/BlogOverview"

export const metadata = {
  title: 'Tin tức',
  description: 'Tin tức',
}

export default function Page() {
  return (
    <>
      <link rel="canonical" href={`${process.env.NEXT_PUBLIC_DOMAIN}/tin-tuc`} />
      <BlogOverview activeCategory="NEWS" activeTag="" />
    </>
  )
};
