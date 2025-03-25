import BlogOverview from "@/components/blog/BlogOverview"

export const metadata = {
  title: 'Tin tức',
  description: 'Tin tức',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_DOMAIN}/tin-tuc`,
  },
}

export default function Page() {
  return (
    <>
      <BlogOverview activeCategory="NEWS" activeTag="" />
    </>
  )
};
