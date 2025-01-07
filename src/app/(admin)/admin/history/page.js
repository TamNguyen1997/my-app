import History from "./History"

export async function generateMetadata() {
  return {
    title: "Dụng cụ vệ sinh Sao Việt - Admin lịch sử truy xuất dữ liệu",
    description: "Dụng cụ vệ sinh Sao Việt - Admin lịch sử truy xuất dữ liệu",
  }
}

const Page = () => {
  return <>
    <History />
  </>
}

export default Page