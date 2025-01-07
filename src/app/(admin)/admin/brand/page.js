import Brand from "./Brand"

export async function generateMetadata() {
  return {
    title: "Dụng cụ vệ sinh Sao Việt - Admin category",
    description: "Dụng cụ vệ sinh Sao Việt - Admin category",
  }
}

const Page = () => {
  return <>
    <Brand />
  </>
}

export default Page