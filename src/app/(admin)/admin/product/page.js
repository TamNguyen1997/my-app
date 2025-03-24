import ProductCms from "./ProductCms"
import { db } from "@/app/db"
export async function generateMetadata() {
  return {
    title: "Dụng cụ vệ sinh Sao Việt - Admin sản phẩm",
    description: "Dụng cụ vệ sinh Sao Việt - Admin sản phẩm",
  }
}

const Page = async () => {
  const filters = await db.filter.findMany({
    include: {
      filterValue: true
    },
    orderBy: [
      {
        updatedAt: "desc"
      }
    ]
  })
  return <>
    <ProductCms filters={filters} />
  </>
}

export default Page