
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

  // Query filter_value_on_sale_detail safely (avoid deep nested include that panics Prisma)
  const fvsds = await db.filter_value_on_sale_detail.findMany({
    where: {
      saleDetailId: saleDetailId
    },
    select: {
      id: true,
      saleDetailId: true,
      filterValueId: true,
      createdAt: true,
      updatedAt: true,
    }
  })

  // Get filter values separately
  const filterValueIds = Array.from(new Set(fvsds.map((x) => x.filterValueId).filter(Boolean)))
  const filterValues = filterValueIds.length
    ? await db.filter_value.findMany({
        where: { id: { in: filterValueIds } },
        select: {
          id: true,
          value: true,
          filterId: true,
        },
      })
    : []

  // Get filters separately
  const filterIdSet = Array.from(new Set(filterValues.map((fv) => fv.filterId).filter(Boolean)))
  const filters = filterIdSet.length
    ? await db.filter.findMany({
        where: { id: { in: filterIdSet } },
        select: { id: true, name: true },
      })
    : []

  // Manually join the data
  const filterById = new Map(filters.map((f) => [f.id, f]))
  const filterValueById = new Map(
    filterValues.map((fv) => [fv.id, { ...fv, filter: fv.filterId ? filterById.get(fv.filterId) || null : null }])
  )

  const filterValueOnSaleDetail = fvsds.map((row) => ({
    ...row,
    filterValue: row.filterValueId ? filterValueById.get(row.filterValueId) || null : null,
  }))

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
