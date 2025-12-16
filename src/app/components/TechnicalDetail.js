import { useContext, useMemo } from "react";
import { v4 } from "uuid";
import { ProductDetailContext } from "./product/ProductDetail";

const TechnicalDetail = ({ data = [] }) => {
  const { selectedSaleDetail = {} } = useContext(ProductDetailContext) || {};

  const result = useMemo(() => {
    const productTechnical = data.map(item => ({
      id: v4(),
      filter: item.filter?.name,
      filterValue: item.filterValue?.value,
      updatedAt: item.updatedAt || item.updated_at
    }));

    const filterValueOnSaleDetail = (selectedSaleDetail?.filter_value_on_sale_detail || []).map(item => ({
      id: v4(),
      filter: item?.filterValue?.filter?.name,
      filterValue: item?.filterValue?.value,
      updatedAt: item.updatedAt || item.updated_at
    }));

    return [
      ...productTechnical,
      ...filterValueOnSaleDetail
    ].filter(item => item.filterValue && item.filter);
  }, [data, selectedSaleDetail]);

  return (
    <div className="pt-6">
      <div className="relative overflow-x-auto border rounded-2xl shadow-md">
        <table className="w-full text-left rtl:text-right">
          <tbody>
            {result.map((item, index) => (
              <tr key={item.id} className={`border-gray-200 ${index % 2 !== 0 ? "bg-gray-100" : ""}`}>
                <th scope="row" className="px-6 py-4 font-medium whitespace-nowrap">
                  {item.filter}
                </th>
                <td className="px-6 py-4">
                  {item.filterValue}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TechnicalDetail;