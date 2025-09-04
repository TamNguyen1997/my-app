import { db } from "@/app/db"
import PromotionProgramDetail from "@/components/admin/ui/PromotionProgramDetail";
import { cate_type } from "@prisma/client";
import { redirect } from "next/navigation";

export async function generateMetadata() {
  return {
    title: "Chương trình khuyến mãi | Dụng cụ vệ sinh Sao Việt",
    description: "Quản lý chương trình khuyến mãi tại Dụng cụ vệ sinh Sao Việt",
  }
}

const Page = async ({ params }) => {
  const promotionProgram = await db.promotion_program.findFirst({
    where: {
      id: params.id
    },
    include: {
      category: true,
      product: true,
      saleDetail: true
    }
  })

  if (!promotionProgram) redirect("/admin/promotion")

  const allCategories = await db.category.findMany({
    where: {
      active: true
    }
  })

  const allProducts = await db.product.findMany({
    where: {
      active: true
    },
    include: {
      saleDetails: true
    }
  })

  const categories = allCategories.filter(item => item.type === cate_type.CATE)
  const subCategories = allCategories.filter(item => item.type === cate_type.SUB_CATE)

  const allSaleDetails = allProducts.flatMap(item => item.saleDetails)

  return <PromotionProgramDetail
    promotionProgram={promotionProgram}
    allCategories={categories}
    allSubcategories={subCategories}
    allProducts={allProducts}
    allSaleDetails={allSaleDetails}
  />
}

export default Page
