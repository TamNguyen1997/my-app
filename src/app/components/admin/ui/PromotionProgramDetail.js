"use client"

import { Input, Textarea, Autocomplete, AutocompleteItem, Button, Checkbox } from "@heroui/react";
import { Accordion, AccordionItem } from "@heroui/accordion";
import { cate_type } from "@prisma/client";
import { X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { v4 } from "uuid";
import { toast, ToastContainer } from "react-toastify";
import { navigate } from "@/lib/utils";
import { useEditor } from "@tiptap/react";
import { editorConfig } from "@/lib/editor";
import RichTextEditor from "@/app/components/admin/ui/RichTextArea"

const PromotionProgramDetail = ({
  promotionProgram = {},
  allProducts = [],
  allCategories = [],
  allSubcategories = [],
  allSaleDetails = []
}) => {
  const [name, setName] = useState(promotionProgram.name || "");
  const [isActive, setIsActive] = useState(promotionProgram.active || false)
  const [selectedCategoryIds, setSelectedCategoryIds] = useState(promotionProgram.category?.filter(item => item.type === cate_type.CATE).map(item => item.id) || []);
  const [selectedSubCategoryIds, setSelectedSubCategoryIds] = useState(promotionProgram.category?.filter(item => item.type === cate_type.SUB_CATE).map(item => item.id) || []);
  const [selectedProductIds, setSelectedProductIds] = useState(promotionProgram.product?.map(item => item.id) || []);
  const [selectedSaleDetailIds, setSelectedSaleDetailIds] = useState(promotionProgram.saleDetail?.map(item => item.id) || []);
  const editor = useEditor(editorConfig(promotionProgram.promotion))
  const onSave = async () => {
    toast.promise(
      fetch(`/api/promotion-program`, {
        method: "POST", body: JSON.stringify({
          id: promotionProgram.id || v4(),
          name: name,
          active: isActive,
          promotion: editor.getHTML(),
          categoryIds: [...selectedCategoryIds, ...selectedSubCategoryIds],
          productIds: selectedProductIds,
          saleDetailIds: selectedSaleDetailIds
        })
      }).then(async (res) => {
        if (!res.ok) {
          throw new Error((await res.json()).message)
        }
      }),
      {
        pending: 'Đang lưu chương trình khuyến mãi',
        success: 'Đã lưu chương trình khuyến mãi',
        error: {
          render({ data }) {
            return `Không thể cập nhật: ${data.message}`
          }
        }
      },
      {
        containerId: "PromotionProgramDetail"
      }
    )
  }

  const onDelete = async () => {
    if (!confirm("Bạn có muốn xóa chương trình khuyến mãi này?")) return

    toast.promise(
      fetch(`/api/promotion-program/${promotionProgram.id}`, { method: "DELETE" }).then(async (res) => {
        if (!res.ok) {
          throw new Error((await res.json()).message)
        }
      }),
      {
        pending: 'Đang xóa chương trình khuyến mãi',
        success: {
          render() {
            navigate("/admin/promotion")
            return 'Đã xóa chương trình khuyến mãi'
          }
        },
        error: {
          render({ data }) {
            return `Không thể xóa: ${data.message}`
          }
        }
      },
      {
        containerId: "PromotionProgramDetail"
      }
    )
  }

  return (
    <>
      <ToastContainer containerId="PromotionProgramDetail" />
      <div className="flex flex-col gap-3 pb-3 ml-2">
        <div className="grid md:grid-cols-12 grid-cols-8 gap-3">
          <Input
            className="col-span-7 md:col-span-11"
            label="Tên chương trình khuyến mãi"
            placeholder="Nhập tên chương trình khuyến mãi"
            width={"50%"}
            defaultValue={name}
            onValueChange={value => setName(value)}
            isRequired
          />
          <Checkbox
            defaultSelected={isActive}
            onValueChange={setIsActive}
          >Active</Checkbox>
        </div>

        <div>
          <label htmlFor="Chương trình khuyến mãi" >Chương trình khuyến mãi</label>
          <RichTextEditor id="Chương trình khuyến mãi" editor={editor} disable={{
            image: true,
            video: true,
            table: true,
            font: true,
            highlight: true,
            subscript: true,
            superscript: true,
            replace: true,
            breakLine: true,
            button: true,
            indent: true,
            copy: true,
            checkbox: true,
            multicheckbox: true,
            code: true,
            textColor: true,
            orderedList: true,
            quote: true,
            textAlign: true
          }} />
        </div>
      </div>
      <Accordion variant="splitted">
        <AccordionItem value="category" title="Category" aria-label="Category" key="category">
          <div className="grid md:grid-cols-3 gap-3 p-3">
            <Autocomplete selectedKey={[]} onSelectionChange={(id) => setSelectedCategoryIds(prev => [...prev, id])}
              label="Tìm category"
              aria-label="Tìm category"
              className="col-span-1">
              {
                allCategories.filter(item => !selectedCategoryIds.includes(item.id)).map((category, i) => (
                  <AutocompleteItem key={category.id} aria-label={category.name} label={category.name}>
                    <p>{category.name}</p>
                    <p className="text-sm">{category.slug}</p>
                  </AutocompleteItem>
                ))
              }
            </Autocomplete>

            <div className="col-span-2 border-l-2 pl-2">
              <div className="flex gap-3 flex-wrap">
                {selectedCategoryIds.map((categoryId, index) => (
                  <div className="group" key={index}>
                    <span className="bg-gray-100 text-gray-800 text-sm font-medium me-2 flex p-2.5 rounded-3xl dark:bg-gray-700 dark:text-gray-300">
                      <Link href="#">
                        {allCategories.find(item => item.id === categoryId)?.name || "Unknown Category"}
                      </Link>
                      <span
                        className="hidden group-hover:block animate-vote text-red-500 rounded-full hover:bg-white"
                        onClick={() => setSelectedCategoryIds(prev => prev.filter(item => item !== categoryId))}><X /></span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </AccordionItem>
        <AccordionItem value="sub-category" title="Sub-category" aria-label="Sub-category" key="sub-category">
          <div className="grid md:grid-cols-3 gap-3 p-3">
            <Autocomplete selectedKey={[]} onSelectionChange={(id) => setSelectedSubCategoryIds(prev => [...prev, id])}
              label="Tìm sub-category"
              aria-label="Tìm sub-category"
              className="col-span-1"
              itemHeight={48}>
              {
                allSubcategories.filter(item => !selectedSubCategoryIds.includes(item.id)).map((subCate, i) => (
                  <AutocompleteItem key={subCate.id} aria-label={subCate.name} label={subCate.name}>
                    <p>{subCate.name}</p>
                    <p className="text-sm">{subCate.slug}</p>
                  </AutocompleteItem>
                ))
              }
            </Autocomplete>

            <div className="col-span-2 border-l-2 pl-2">
              <div className="flex gap-3 flex-wrap">
                {selectedSubCategoryIds.map((subCateId, index) => (
                  <div className="group" key={index}>
                    <span className="bg-gray-100 text-gray-800 text-sm font-medium me-2 flex p-2.5 rounded-3xl dark:bg-gray-700 dark:text-gray-300">
                      <Link href="#">
                        {allSubcategories.find(item => item.id === subCateId)?.name || "Unknown Sub Category"}
                      </Link>
                      <span
                        className="hidden group-hover:block animate-vote text-red-500 rounded-full hover:bg-white"
                        onClick={() => setSelectedSubCategoryIds(prev => prev.filter(item => item !== subCateId))}><X /></span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </AccordionItem>
        <AccordionItem value="Sản phẩm" title="Sản phẩm" aria-label="Sản phẩm" key="product">
          <div className="grid md:grid-cols-3 gap-3 p-3">
            <Autocomplete selectedKey={[]} onSelectionChange={(id) => setSelectedProductIds(prev => [...prev, id])}
              label="Tìm sản phẩm"
              aria-label="Tìm sản phẩm"
              className="col-span-1"
              itemHeight={48}
              size="lg">
              {
                allProducts.filter(item => !selectedProductIds.includes(item.id)).map((product, i) => (
                  <AutocompleteItem key={product.id} aria-label={product.name} label={product.name}>
                    <p>{product.name}</p>
                  </AutocompleteItem>
                ))
              }
            </Autocomplete>

            <div className="col-span-2 border-l-2 pl-2">
              <div className="flex gap-3 flex-wrap">
                {selectedProductIds.map((productId, index) => (
                  <div className="group" key={index}>
                    <span className="bg-gray-100 text-gray-800 text-sm font-medium me-2 flex p-2.5 rounded-3xl dark:bg-gray-700 dark:text-gray-300">
                      <Link href="#">
                        {allProducts.find(item => item.id === productId)?.name || "Unknown Sub Category"}
                      </Link>
                      <span
                        className="hidden group-hover:block animate-vote text-red-500 rounded-full hover:bg-white"
                        onClick={() => setSelectedProductIds(prev => prev.filter(item => item !== productId))}><X /></span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </AccordionItem>
        <AccordionItem value="Thông số bán hàng" title="Thông số bán hàng" aria-label="Thông số bán hàng" key="sale-detail">
          <div className="grid md:grid-cols-3 gap-3 p-3">
            <Autocomplete selectedKey={[]} onSelectionChange={(id) => setSelectedSaleDetailIds(prev => [...prev, id])}
              label="Tìm Thông số bán hàng"
              aria-label="Tìm Thông số bán hàng"
              className="col-span-1"
              itemHeight={48}>
              {
                allSaleDetails.filter(item => !selectedSaleDetailIds.includes(item.id)).map((saleDetail, i) => (
                  <AutocompleteItem key={saleDetail.id} aria-label={saleDetail.sku} label={saleDetail.sku}>
                    <p>{saleDetail.sku}</p>
                  </AutocompleteItem>
                ))
              }
            </Autocomplete>

            <div className="col-span-2 border-l-2 pl-2">
              <div className="flex gap-3 flex-wrap">
                {selectedSaleDetailIds.map((saleDetailId, index) => (
                  <div className="group" key={index}>
                    <span className="bg-gray-100 text-gray-800 text-sm font-medium me-2 flex p-2.5 rounded-3xl dark:bg-gray-700 dark:text-gray-300">
                      <Link href="#">
                        {allSaleDetails.find(item => item.id === saleDetailId)?.sku || "Unknown Sub Category"}
                      </Link>
                      <span
                        className="hidden group-hover:block animate-vote text-red-500 rounded-full hover:bg-white"
                        onClick={() => setSelectedSaleDetailIds(prev => prev.filter(item => item !== saleDetailId))}><X /></span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </AccordionItem>
      </Accordion>
      <Button className="m-2"
        isDisabled={!name}
        color="primary" onPress={onSave}>Lưu</Button>
      <Button className="m-2"
        color="danger"
        isDisabled={!promotionProgram.id}
        onPress={onDelete}>Xóa</Button>
      <Link href="/admin/promotion">
        <Button className="m-2"
          variant="ghost">Trở về</Button>
      </Link>
    </>
  );
}

export default PromotionProgramDetail;