import { db } from "@/app/db";
import { EXPORT_MESSAGE } from "@/constants/message";
import { NextResponse } from "next/server";
import * as XLSX from "xlsx";

const LIMIT = 1000;
export async function GET(req) {
  const url = new URL(req.url);
  const searchParams = url.searchParams;

  const start = parseInt(searchParams.get("start") || "0");
  const end = parseInt(searchParams.get("end") || `${LIMIT}`);
  const limit = end - start;
  try {
    const result = await db.product.findMany({
      take: limit,
      skip: start,
      orderBy: {
        updatedAt: "desc",
      },
      select: {
        id: true,
        sku: true,
        name: true,
        slug: true,
        categoryId: true,
        subCateId: true,
        active: true,
        saleDetails: {
          select: {
            price: true,
            promotionalPrice: true,
            showPrice: true,
            inStock: true,
          },
        },
        technical_detail: {
          select: {
            filterId: true,
            filterValueId: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });

    const headers = [
      "ID SP",
      "SKU",
      "Tên",
      "URL SP",
      "ID Cate",
      "ID sub-cate",
      "ID filter",
      "ID giá trị filter",
      "SL tồn kho",
      "Trạng thái active",
      "Giá thường",
      "Giá giảm",
      "Giá liên hệ",
      "Ngày tạo",
      "Ngày update",
    ];

    console.log(result)

    const data = result.map((el) => ({
      "ID SP": el.id,
      SKU: el.sku || "N/A",
      Tên: el.name || "N/A",
      "URL SP": el.slug || "N/A",
      "ID Cate": el.categoryId || "N/A",
      "ID sub-cate": el.subCateId || "N/A",
      "ID filter":
        el.technical_detail.length > 0
          ? el.technical_detail[0].filterId
          : "N/A",
      "ID giá trị filter":
        el.technical_detail.length > 0
          ? el.technical_detail[0].filterValueId
          : "N/A",
      "SL tồn kho": el.saleDetails.inStock || 0,
      "Trạng thái active": el.active ? "T" : "F",
      "Giá thường": el.saleDetails.length > 0 ? el.saleDetails[0].price : "N/A",
      "Giá giảm":
        el.saleDetails.length > 0 ? el.saleDetails[0].promotionalPrice : "N/A",
      "Giá liên hệ":
        el.saleDetails.length > 0 ? el.saleDetails[0].promotionalPrice : "N/A",
      "Ngày tạo": new Date(el.createdAt).toLocaleDateString(),
      "Ngày update": new Date(el.updatedAt).toLocaleDateString(),
    }));

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data, { header: headers });

    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });

    return new NextResponse(buffer, {
      headers: {
        "Content-Disposition": 'attachment; filename="data.xlsx"',
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: EXPORT_MESSAGE.EXPORT_FAILED },
      { status: 500 }
    );
  }
}
