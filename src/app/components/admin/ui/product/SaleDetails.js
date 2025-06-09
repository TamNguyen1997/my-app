import { Button, Checkbox, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, Snippet, useDisclosure } from "@nextui-org/react";
import { Cog, FileImage, Trash2 } from "lucide-react";
import { useContext } from "react";
import { v4 } from "uuid";
import NewFilter from "@/components/admin/ui/product/NewFilter";
import { FilterValueSelect } from "./NewFilterValue";
import { ProductContext } from "../../../../(admin)/admin/product/edit/[id]/default";
import crypto from "crypto";
import Link from "next/link";

const removeItem = (id, setProduct) => {
  setProduct(prevProduct => ({
    ...prevProduct,
    saleDetails: prevProduct.saleDetails.filter(item => item.id !== id)
  }));
};

const handleDetailChange = (id, value, setProduct) => {
  setProduct(prevProduct => ({
    ...prevProduct,
    saleDetails: prevProduct.saleDetails.map(detail =>
      detail.id === id ? { ...detail, ...value } : detail
    )
  }));
};

// const SecondarySaleDetails = ({ saleDetail }) => {
//   const newFilterModal = useDisclosure();
//   const { product, filters, setFilters, setProduct } = useContext(ProductContext);

//   return (
//     <div className="flex flex-col gap-2">
//       {product.saleDetails?.filter(item => item.saleDetailId === saleDetail.id).map(detail => (
//         <div className="flex" key={detail.id}>
//           <div className="w-11/12">
//             <div className="flex gap-2">
//               <Input
//                 type="text"
//                 label="SKU"
//                 className="w-1/2"
//                 defaultValue={detail.sku}
//                 aria-label="SKU"
//                 isRequired
//                 onValueChange={value => handleDetailChange(detail.id, { sku: value }, setProduct)}
//               />
//               <Select
//                 label="Filter"
//                 isRequired
//                 selectedKeys={[detail.filterId]}
//                 onSelectionChange={value => {
//                   const selectedValue = value.values().next().value;
//                   if (selectedValue !== "new") {
//                     handleDetailChange(detail.id, { filterId: selectedValue }, setProduct);
//                   } else {
//                     newFilterModal.onOpen();
//                   }
//                 }}
//               >
//                 <SelectItem textValue="Thêm filter" key="new">
//                   <div className="font-bold w-full flex justify-between">
//                     Thêm filter
//                   </div>
//                 </SelectItem>
//                 {filters?.map(item => (
//                   <SelectItem key={item.id}>{item.name}</SelectItem>
//                 ))}
//               </Select>

//               <Modal
//                 scrollBehavior="inside"
//                 size="xl"
//                 isOpen={newFilterModal.isOpen}
//                 onOpenChange={newFilterModal.onOpenChange}
//               >
//                 <ModalContent>
//                   {(onClose) => (
//                     <>
//                       <ModalHeader className="flex flex-col gap-1">Filter mới</ModalHeader>
//                       <ModalBody>
//                         <NewFilter
//                           filters={filters}
//                           setFilters={setFilters}
//                           callback={(value) => {
//                             handleDetailChange(detail.id, { filterId: value }, setProduct);
//                             onClose();
//                           }}
//                         />
//                       </ModalBody>
//                       <ModalFooter>
//                         <Button color="danger" variant="light" onPress={onClose}>
//                           Đóng
//                         </Button>
//                       </ModalFooter>
//                     </>
//                   )}
//                 </ModalContent>
//               </Modal>

//               <FilterValueSelect
//                 detail={detail}
//                 getFilter={() => filters.find(filter => filter.id === detail.filterId)}
//                 filters={filters}
//                 brandId={product.brandId}
//                 categoryId={product.categoryId}
//                 subCategoryId={product.subCateId}
//                 onSelectionChange={(value, detailId) => handleDetailChange(detailId, { filterValueId: value.filterValueId }, setProduct)}
//               />
//               <Input
//                 type="number"
//                 label="Giá"
//                 defaultValue={detail.price}
//                 aria-label="Giá"
//                 min={0}
//                 max={999999999}
//                 isRequired
//                 onValueChange={value => handleDetailChange(detail.id, { price: parseInt(value) }, setProduct)}
//               />
//               <Input
//                 type="number"
//                 label="Giá giảm"
//                 defaultValue={detail.promotionalPrice}
//                 aria-label="Giá"
//                 min={0}
//                 max={999999999}
//                 onValueChange={value => handleDetailChange(detail.id, { promotionalPrice: parseInt(value) }, setProduct)}
//               />
//               <Input
//                 type="number"
//                 label="Tồn kho"
//                 defaultValue={detail.inStock}
//                 aria-label="Giá"
//                 className="w-1/2"
//                 min={0}
//                 max={999999999}
//                 onValueChange={value => handleDetailChange(detail.id, { inStock: parseInt(value) }, setProduct)}
//               />
//               <Checkbox
//                 className="w-full"
//                 isSelected={detail.showPrice}
//                 onValueChange={value => handleDetailChange(detail.id, { showPrice: value }, setProduct)}
//               >
//                 Hiện giá
//               </Checkbox>
//             </div>
//           </div>

//           <div className="pt-3 pl-3">
//             <div className="text-lg text-danger cursor-pointer active:opacity-50 pl-5 float-right">
//               <Trash2 onClick={() => removeItem(detail.id, setProduct)} />
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

const SaleDetails = () => {
  const { product, filters, setFilters, setProduct } = useContext(ProductContext);
  const newFilterModal = useDisclosure();

  const addEmptySaleDetail = () => {
    const newSaleDetails = [
      ...product.saleDetails,
      { id: v4(), productId: product.id, type: "TEXT", price: 0, sku: crypto.randomBytes(3).toString("hex") }
    ];
    setProduct(prevProduct => ({ ...prevProduct, saleDetails: newSaleDetails }));
  };

  return (
    <>
      {(!product.categoryId || !product.subCateId || !product.brandId) && (
        <div>
          <ul className="list-disc text-red-400 list-inside">
            <li>Sản phẩm phải có category và subcategory mới có thể thêm mới giá trị filter</li>
            <li>Sản phẩm phải có thương hiệu mới có thể thêm mới giá trị filter</li>
          </ul>
        </div>
      )}
      <div className="p-2">
        <Button color="default" variant="ghost" size="sm" className="float-right" onPress={addEmptySaleDetail}>
          Thêm thông số
        </Button>
      </div>
      <div className="flex flex-col gap-2 p-2">
        {product.saleDetails?.filter(item => !item.saleDetailId).map(detail => (
          <div key={detail.id}>
            <div className="flex">
              <div className="w-full">
                <div className="flex gap-2">
                  <Input
                    type="text"
                    label="SKU"
                    className="w-1/2"
                    defaultValue={detail.sku}
                    aria-label="SKU"
                    isRequired
                    onValueChange={value => handleDetailChange(detail.id, { sku: value }, setProduct)}
                  />
                  <div className="flex flex-col w-full gap-1">
                    <Select
                      label="Filter"
                      selectedKeys={[detail.filterId]}
                      isRequired
                      onSelectionChange={value => {
                        const selectedValue = value.values().next().value;
                        if (selectedValue !== "new") {
                          handleDetailChange(detail.id, { filterId: selectedValue }, setProduct);
                        } else {
                          newFilterModal.onOpen();
                        }
                      }}
                    >
                      <SelectItem textValue="Thêm filter" key="new">
                        <div className="font-bold w-full flex justify-between">
                          Thêm filter
                        </div>
                      </SelectItem>
                      {filters?.map(item => (
                        <SelectItem key={item.id} textValue={item.name}>
                          <p>
                            {item.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {item.id}
                          </p>
                        </SelectItem>
                      ))}
                    </Select>
                    <p className="text-gray-500 text-xs">
                      {filters?.find(f => f.id === detail.filterId)?.displayId}
                    </p>
                  </div>

                  <Modal
                    scrollBehavior="inside"
                    size="xl"
                    isOpen={newFilterModal.isOpen}
                    onOpenChange={newFilterModal.onOpenChange}
                  >
                    <ModalContent>
                      {(onClose) => (
                        <>
                          <ModalHeader className="flex flex-col gap-1">Filter mới</ModalHeader>
                          <ModalBody>
                            <NewFilter
                              filters={filters}
                              setFilters={setFilters}
                              callback={(value) => {
                                handleDetailChange(detail.id, { filterId: value }, setProduct);
                                onClose();
                              }}
                            />
                          </ModalBody>
                          <ModalFooter>
                            <Button color="danger" variant="light" onPress={onClose}>
                              Đóng
                            </Button>
                          </ModalFooter>
                        </>
                      )}
                    </ModalContent>
                  </Modal>

                  <FilterValueSelect
                    detail={detail}
                    getFilter={() => filters.find(filter => filter.id === detail.filterId)}
                    filters={filters}
                    brandId={product.brandId}
                    categoryId={product.categoryId}
                    subCategoryId={product.subCateId}
                    onSelectionChange={(value, detailId) => handleDetailChange(detailId, { filterValueId: value.filterValueId }, setProduct)}
                  />
                  <Input
                    type="number"
                    label="Giá"
                    defaultValue={detail.price}
                    aria-label="Giá"
                    min={0}
                    max={999999999}
                    isRequired
                    onValueChange={value => handleDetailChange(detail.id, { price: parseInt(value) }, setProduct)}
                  />
                  <Input
                    type="number"
                    label="Giá giảm"
                    defaultValue={detail.promotionalPrice}
                    aria-label="Giá"
                    min={0}
                    max={999999999}
                    onValueChange={value => handleDetailChange(detail.id, { promotionalPrice: parseInt(value) }, setProduct)}
                  />
                  <Input
                    type="number"
                    label="Tồn kho"
                    className="w-1/2"
                    defaultValue={detail.inStock}
                    aria-label="Giá"
                    min={0}
                    max={999999999}
                    onValueChange={value => handleDetailChange(detail.id, { inStock: parseInt(value) }, setProduct)}
                  />
                  <Checkbox
                    isSelected={detail.showPrice}
                    className="w-full"
                    onValueChange={value => handleDetailChange(detail.id, { showPrice: value }, setProduct)}
                  >
                    Hiện giá
                  </Checkbox>

                  <div className="flex text-center items-center">
                    {/* <Button onClick={() => {
                      const newSaleDetails = [
                        ...product.saleDetails,
                        { id: v4(), type: "TEXT", saleDetailId: detail.id, productId: product.id, price: 0, sku: crypto.randomBytes(3).toString("hex") }
                      ];
                      setProduct(prevProduct => ({ ...prevProduct, saleDetails: newSaleDetails }));
                    }}>
                      Thêm
                    </Button> */}
                    <div className="text-lg text-danger cursor-pointer active:opacity-50 pl-5 float-right">
                      <Trash2 onClick={() => removeItem(detail.id, setProduct)} />
                    </div>
                    <Snippet symbol="" className="!font-open_san !bg-white" hideCopyButton content="Xem hình ảnh của thông số bán hàng">
                      <Link className="text-lg text-success cursor-pointer float-right" href={`/admin/product/edit/${product.id}/sale-details/${detail.id}/images/`}>
                        <FileImage />
                      </Link>
                    </Snippet>
                    <Snippet symbol="" className="!font-open_san !bg-white" hideCopyButton content="Xem thông số kĩ thuật">
                      <Link className="text-lg text-gray-500 cursor-pointer float-right" href={`/admin/product/edit/${product.id}/sale-details/${detail.id}/technicals/`}>
                        <Cog />
                      </Link>
                    </Snippet>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default SaleDetails;
