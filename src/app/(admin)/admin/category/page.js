import Category from "./Category"

export async function generateMetadata() {
  return {
    title: "Dụng cụ vệ sinh Sao Việt - Admin category",
    description: "Dụng cụ vệ sinh Sao Việt - Admin category",
  }
}

const Page = () => {
  return <>
    <Category />
  </>
}

export default Page