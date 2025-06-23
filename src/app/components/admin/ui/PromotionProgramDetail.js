"use client"

import { Accordion, Autocomplete } from "@mui/material";
import { AccordionItem, AutocompleteItem, Input, Textarea } from "@nextui-org/react";
import { cate_type } from "@prisma/client";
import { X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const PromotionProgramDetail = ({ promotionProgram = {}, allProducts = [], allCategories = [], allSaleDetails = [] }) => {
  const [name, setName] = useState(promotionProgram.name || "");
  const [promotion, setPromotion] = useState(promotionProgram.promotion || "");

  const [selectedCategoryIds, setSelectedCategoryIds] = useState(promotionProgram.category?.filter(item => item.type === cate_type.CATE).map(item => item.id) || []);
  const [selectedSubCategoryIds, setSelectedSubCategoryIds] = useState(promotionProgram.category?.filter(item => item.type === cate_type.SUB_CATE).map(item => item.id) || []);
  const [selectedProductIds, setSelectedProductIds] = useState(promotionProgram.product?.map(item => item.id) || []);
  const [saleDetail, setSaleDetail] = useState(promotionProgram.saleDetail?.map(item => item.id) || []);
  
  return (
    <>
      <div className="flex flex-col gap-3 pb-3">
        <Input 
          label="Tên chương trình khuyến mãi"
          placeholder="Nhập tên chương trình khuyến mãi"
          width={"50%"}
          defaultValue={name}
          isRequired
        />

        <Textarea 
          label="Nội dung chương trình khuyến mãi"
          placeholder="Nhập nội dung chương trình khuyến mãi"
          defaultValue={promotion}
        />
      </div>
      <Accordion>
        <AccordionItem value="category" title="Category" aria-label="Category" key="category">
          <div className="md:flex gap-3">
            <Autocomplete onSelectionChange={(id) => setSelectedCategoryIds(prev => [...prev, id])}>
              {
                allCategories.filter(item => item.type === cate_type.CATE && selectedCategoryIds.includes(id => id !== item.id)).map((category, i) => (
                  <AutocompleteItem key={category.id}>
                    <p>{category.name}</p>
                    <p className="text-sm">{category.slug}</p>
                  </AutocompleteItem>
                ))
              }
            </Autocomplete>

            <div>
              <div className="grid grid-cols-4 md:grid-cols-2">
                {selectedCategoryIds.map((categoryId, index) => (
                  <div className="group" key={index}>
                    <span className="bg-gray-100 text-gray-800 text-xs font-medium 
                  me-2 px-2.5 py-0.5 rounded-3xl dark:bg-gray-700 dark:text-gray-300 flex">
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
        {/* <AccordionItem value="sub-category" title="Sub-category" aria-label="Sub-category"></AccordionItem>
        <AccordionItem value="product" title="Sản phẩm" aria-label="Sản phẩm"></AccordionItem>
        <AccordionItem value="sale-detail" title="Thông số bán hàng" aria-label="Thông số bán hàng"></AccordionItem> */}
      </Accordion>
    </>
  );
}

export default PromotionProgramDetail;