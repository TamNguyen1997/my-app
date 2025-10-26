import { db } from "@/app/db";
import { EXPORT_MESSAGE } from "@/constants/message";
import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { extractFilterData } from "./exportFilter";
import { extractCategoryOnFilterValueData } from "./exportCategoryOnFilterValue";

const LIMIT = 1000;
export async function GET(req) {
  const url = new URL(req.url);
  const searchParams = url.searchParams;

  const type = searchParams.get("type") || `product`;

  try {
    const worksheet = await getWorksheet(type);

    const workbook = XLSX.utils.book_new();
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

const getWorksheet = (type) => {
  switch (type) {
    case "category_on_filter_value":
      return extractCategoryOnFilterValueData();
    case "filter":
      return extractFilterData();
    case "technical_detail":
      return extractTechnicalDetailData();
    case "sale_detail":
      return extractSaleDetailData();
    case "product":
    default:
      return extractProductData();
  }
}
const extractProductData = async () => {
  const result = await db.product.findMany({
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
      brandId: true,
      active: true,
      metaTitle: true,
      metaDescription: true,
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
    "Tên",
    "ID Cate",
    "ID sub-cate",
    "ID thương hiệu",
    "Trạng thái active",
    "Meta title",
    "Meta description",
  ];

  const data = result.map((el) => ({
    "ID SP": el.id,
    Tên: el.name,
    "ID Cate": el.categoryId,
    "ID sub-cate": el.subCateId,
    "ID thương hiệu": el.brandId,
    "Trạng thái active": el.active ? "T" : "F",
    "Meta title": el.metaTitle,
    "Meta description": el.metaDescription,
  }));

  return XLSX.utils.json_to_sheet(data, { header: headers });
}

const extractTechnicalDetailData = async () => {
  const result = await db.technical_detail.findMany({
    orderBy: {
      updatedAt: "desc",
    },
    select: {
      id: true,
      filterId: true,
      filterValueId: true,
      productId: true,
      createdAt: true,
      updatedAt: true,
      filter: {
        select: {
          id: true,
        },
      },
      filterValue: {
        select: {
          id: true,
        },
      },
    },
  });

  const headers = [
    "ID thông số kỹ thuật",
    "ID SP",
    "ID filter",
    "ID giá trị filter",
    "Ngày tạo",
    "Ngày cập nhật"
  ];

  const data = result.map((el) => ({
    "ID thông số kỹ thuật": el.id,
    "ID SP": el.productId,
    "ID bộ lọc": el.filter?.id,
    "ID giá trị bộ lọc": el.filterValue?.id,
    "Ngày tạo": el.createdAt?.toLocaleString(),
    "Ngày cập nhật": el.updatedAt?.toLocaleString()
  }));

  return XLSX.utils.json_to_sheet(data, { header: headers });
}

const extractSaleDetailData = async () => {
  const result = await db.sale_detail.findMany({
    orderBy: {
      updatedAt: "desc",
    },
    select: {
      id: true,
      productId: true,
      price: true,
      sku: true,
      promotionalPrice: true,
      showPrice: true,
      inStock: true,
      filterId: true,
      filterValueId: true,
      createdAt: true,
      updatedAt: true,
      saleDetailId: true,
      saleDetail: {
        select: {
          sku: true
        }
      },
      filter: {
        select: {
          id: true,
        },
      },
      filterValue: {
        select: {
          id: true,
        },
      },
    },
  });

  const headers = [
    "ID thông số bán hàng",
    "ID SP",
    "SKU",
    "Giá bán thường",
    "Giá khuyến mãi",
    "Giá liên hệ",
    "SL tồn kho",
    "SKU chính",
    "Ngày tạo",
    "Ngày cập nhật",
  ];

  const data = result.map((el) => ({
    "ID thông số bán hàng": el.id,
    "ID SP": el.productId,
    "SKU": el.saleDetailId ? "" : el.sku,
    "Giá bán thường": el.price,
    "Giá khuyến mãi": el.promotionalPrice,
    "Giá liên hệ": el.showPrice ? "T" : "F",
    "ID filter": el.filter?.id,
    "ID giá trị filter": el.filterValue?.id,
    "SL tồn kho": el.inStock,
    "SKU chính": el.saleDetailId ? el.saleDetail?.sku : "",
    "Ngày tạo": el.createdAt?.toLocaleString(),
    "Ngày cập nhật": el.updatedAt?.toLocaleString()
  }));

  return XLSX.utils.json_to_sheet(data, { header: headers });
}