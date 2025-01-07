import Order from "./Order"

export async function generateMetadata() {
  return {
    title: "Dụng cụ vệ sinh Sao Việt - Admin đơn hàng",
    description: "Dụng cụ vệ sinh Sao Việt - Admin đơn hàng",
  }
}

const Page = () => {
  return <>
    <Order />
  </>
}

export default Page