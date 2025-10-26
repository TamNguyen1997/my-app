import { db } from "@/app/db"
import History from "./History"

export async function generateMetadata() {
  return {
    title: "Dụng cụ vệ sinh Sao Việt - Admin lịch sử truy xuất dữ liệu",
    description: "Dụng cụ vệ sinh Sao Việt - Admin lịch sử truy xuất dữ liệu",
  }
}

const Page = async () => {
  const totalProducts = await db.product.count();
  const totalSaleDetails = await db.sale_detail.count();
  const totalTechnicalDetails = await db.technical_detail.count();
  const totalFilters = await db.filter.count();

  return <>
    <History totalProducts={totalProducts} totalSaleDetails={totalSaleDetails} totalTechnicalDetails={totalTechnicalDetails} totalFilters={totalFilters} />
  </>
}

export default Page