import PromotionProgramDetail from "@/components/admin/ui/PromotionProgramDetail";

export async function generateMetadata({ params }) {
  return {
    title: "Chương trình khuyến mãi | Dụng cụ vệ sinh Sao Việt",
    description: "Quản lý chương trình khuyến mãi tại Dụng cụ vệ sinh Sao Việt",
  }
}

const Page = async () => {
  return <PromotionProgramDetail />
}

export default Page
