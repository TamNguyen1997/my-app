import { cate_type } from "@prisma/client"
import ProductCms from "./ProductCms"
import { db } from "@/app/db"
export async function generateMetadata() {
  return {
    title: "Dụng cụ vệ sinh Sao Việt - Admin sản phẩm",
    description: "Dụng cụ vệ sinh Sao Việt - Admin sản phẩm",
  }
}

const Page = async () => {
  const categories = await db.category.findMany({
    where: {
      type: cate_type.CATE
    },
    include: {
      subcates: true
    }
  })
  return <>
    <ProductCms filters={filters} categories={categories} />
  </>
}

export default Page