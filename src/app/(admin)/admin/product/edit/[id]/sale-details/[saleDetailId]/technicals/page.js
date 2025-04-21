
import { db } from '@/app/db'
import TechnicalDetailForSaleDetail from '@/app/components/admin/ui/product/TechnicalDetailForSaleDetail'

export const metadata = {
  title: 'Thông số bán hàng - Dụng cụ vệ sinh Sao Việt',
  description: 'Thông số bán hàng - Dụng cụ vệ sinh Sao Việt'
}

const Page = async ({ params }) => {
  const { saleDetailId, id } = params
  const technical_detail_for_sale_detail = await db.technical_detail_for_sale_detail.findFirst({
    where: {
      saleDetailId: saleDetailId
    }
  })

  const technicalDetails = JSON.parse(technical_detail_for_sale_detail?.technicalDetails || "[]")

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Thông số kĩ thuật {saleDetailId}</h1>
      <div className="flex flex-col gap-4">
        <TechnicalDetailForSaleDetail technicalDetails={technicalDetails} productId={id} saleDetailId={saleDetailId} />
      </div>
    </div>
  );
};

export default Page;
