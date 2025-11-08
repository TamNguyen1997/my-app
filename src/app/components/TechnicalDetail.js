import { useContext, useMemo } from "react";
import { v4 } from "uuid";
import { ProductDetailContext } from "./product/ProductDetail";

const TechnicalDetail = ({ data = [] }) => {
  const contextValue = useContext(ProductDetailContext);
  
  // Check if context is actually provided (not using default values)
  const isContextProvided = contextValue.setSelectedSaleDetail !== (() => {});
  const selectedSaleDetail = useMemo(() => {
    return isContextProvided ? (contextValue?.selectedSaleDetail || {}) : {};
  }, [isContextProvided, contextValue?.selectedSaleDetail]);

  const result = useMemo(() => {
    const productTechnical = data.map(item => {
      return {
        id: v4(),
        filter: item.filter?.name,
        filterValue: item.filterValue?.value,
        updatedAt: item.updatedAt || item.updated_at
      }
    })

    const filterValueOnSaleDetail = (selectedSaleDetail?.filter_value_on_sale_detail || [])
    .sort((a, b) => {
      const aT = a.updatedAt ? new Date(a.updatedAt).getTime() : 0
      const bT = b.updatedAt ? new Date(b.updatedAt).getTime() : 0
      return aT - bT
    })
    .map(item => {
      return {
        id: v4(),
        filter: item?.filterValue?.filter?.name,
        filterValue: item?.filterValue?.value,
        updatedAt: item.updatedAt || item.updated_at
      }
    })

    const merged = [
      ...productTechnical,
      ...filterValueOnSaleDetail
    ]

    return merged
  }, [data, selectedSaleDetail])

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