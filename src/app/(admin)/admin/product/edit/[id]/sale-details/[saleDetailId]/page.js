
import { db } from '@/app/db'
import SaleDetailImages from '@/app/components/admin/ui/product/SaleDetailImages'

export const metadata = {
  title: 'Thông số bán hàng - Dụng cụ vệ sinh Sao Việt',
  description: 'Thông số bán hàng - Dụng cụ vệ sinh Sao Việt'
}

const Page = async ({ params }) => {
  const { saleDetailId } = params
  const saleDetail = await db.sale_detail.findUnique({
    where: {
      id: saleDetailId
    },
    include: {
      sale_detail_on_image: true
    }
  })

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Sale Detail</h1>
      <div className="flex flex-col gap-4">
        <SaleDetailImages saleDetail={saleDetail} />
      </div>
    </div>
  );
};

export default Page;
