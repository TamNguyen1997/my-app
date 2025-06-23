"use client"

import { Button, Input } from "@heroui/react";
import Link from "next/link";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { v4 } from "uuid";

const TechnicalDetailForSaleDetail = ({ productId, saleDetailId, technicalDetails = [] }) => {
  const [details, setDetails] = useState(technicalDetails || []);
  const onSave = async () => {
    const res = await fetch(`/api/products/${productId}/sale-details/${saleDetailId}/technicals/`, {
      method: "PUT",
      body: JSON.stringify({
        technicalDetails: JSON.stringify(details)
      }),
    })

    if (res.ok) {
      toast.success("Cập nhật thành công", { containerId: "technicalDetailForSaleDetail" });
    } else {
      toast.error("Không thể cập nhật thông số", { containerId: "technicalDetailForSaleDetail" });
    }
  }
  return (
    <>
      <ToastContainer containerId="technicalDetailForSaleDetail" />
      {
        details.map((item, index) => (
          <div key={index} className="flex gap-2">
            <Input
              label="Thông số kỹ thuật"
              defaultValue={item.key}
              onValueChange={(value) => {
                let updateDetails = [...details]
                updateDetails.forEach(detail => {
                  if (detail.id === item.id) {
                    detail.key = value
                  }
                })
                setDetails([...updateDetails])
              }}
            />
            <Input
              label="Giá trị"
              defaultValue={item.value}
              onValueChange={(value) => {
                let updateDetails = [...details]
                updateDetails.forEach(detail => {
                  if (detail.id === item.id) {
                    detail.value = value
                  }
                })
                setDetails([...updateDetails])
              }}
            />
            <Button
              className="mt-4"
              onClick={() => {
                setDetails(details.filter(detail => detail.id !== item.id))
              }}
            >
              Xóa
            </Button>
          </div>
        ))
      }
      <div className="flex gap-2">
        <Link href={`/admin/product/edit/${productId}/`}>
          <Button className="mt-4" color="default">
            Quay lại
          </Button>
        </Link>
        <Button
          className="mt-4"
          onClick={() => {
            setDetails([
              ...details,
              { key: "", value: "", id: v4() }
            ])
          }}
        >
          Thêm thông số kỹ thuật
        </Button>
        <Button
          className="mt-4"
          color="primary"
          onClick={onSave}
        >Lưu</Button>
      </div>
    </>
  );
};


export default TechnicalDetailForSaleDetail;
