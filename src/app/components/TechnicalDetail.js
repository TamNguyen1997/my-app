import { useContext, useMemo } from "react";
import { v4 } from "uuid";
import { ProductDetailContext } from "./product/ProductDetail";

const TechnicalDetail = ({ data = [] }) => {
  const { selectedSaleDetail } = useContext(ProductDetailContext);
  const result = [
    ...data.map(item => {
      return {
        id: v4(),
        filter: item.filter?.name,
        filterValue: item.filterValue?.value
      }
    }),
    ...(JSON.parse(selectedSaleDetail?.technical_detail_for_sale_detail ? selectedSaleDetail?.technical_detail_for_sale_detail[0]?.technicalDetails || "[]" : "[]")?.map(item => {
      return {
        id: item.id,
        filter: item.key,
        filterValue: item.value
      }
    }) || [])
  ]

  return (<>
    <div className="pt-6">
      <div className="relative overflow-x-auto border rounded-2xl shadow-md">
        <table className="w-full text-left rtl:text-right">
          <tbody>
            {
              result.map((item, index) => {
                return <tr key={index} className={`border-gray-200 ${index % 2 != 0 ? "bg-gray-100" : ""}`}>
                  <th scope="row" className="px-6 py-4 font-medium whitespace-nowrap">
                    {item.filter}
                  </th>
                  <td className="px-6 py-4">
                    {item.filterValue}
                  </td>
                </tr>
              })
            }
          </tbody>
        </table>
      </div>
    </div>
  </>)
}

export default TechnicalDetail