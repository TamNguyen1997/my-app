import Support from "./Support"

export async function generateMetadata() {
  return {
    title: "Dụng cụ vệ sinh Sao Việt - Admin trang hỗ trợ",
    description: "Dụng cụ vệ sinh Sao Việt - Admin trang hỗ trợ",
  }
}

const Page = () => {
  return <>
    <Support />
  </>
}

export default Page