import ProductCms from "./ProductCms"

export async function generateMetadata() {
  return {
    title: "Dụng cụ vệ sinh Sao Việt - Admin sản phẩm",
    description: "Dụng cụ vệ sinh Sao Việt - Admin sản phẩm",
  }
}

const Redirect = () => {
  return <>
    <ProductCms />
  </>
}

export default Redirect