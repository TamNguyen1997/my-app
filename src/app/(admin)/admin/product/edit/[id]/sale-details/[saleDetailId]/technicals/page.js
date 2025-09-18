
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

  const filterValueOnSaleDetail = await db.filter_value_on_sale_detail.findMany({
    where: {
      saleDetailId: saleDetailId
    },
    include: {
      filterValue: {
        include: {
          filter: true
        }
      }
    }
  })

  const allFilters = await db.filter.findMany({
    include: {
      filterValue: true
    }
  })

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Thông số kĩ thuật</h1>
      <div className="flex flex-col gap-4">
        <TechnicalDetailForSaleDetail 
          allFilters={allFilters}
          filterValueOnSaleDetail={filterValueOnSaleDetail}
          productId={id} 
          saleDetailId={saleDetailId} />
      </div>
    </div>
  );
};

export default Page;
