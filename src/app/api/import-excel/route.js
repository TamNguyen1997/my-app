import * as XLSX from "xlsx"
import { db } from "@/app/db"
import { NextResponse } from "next/server"
import { history_status } from "@prisma/client"
import { IMPORT_MESSAGE } from "@/constants/message"

export const config = {
  api: {
    bodyParser: false,
  },
}

function isValidUUID(uuid) {
  return /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
    uuid
  )
}

async function validateProduct(cateId, subCateId, brandId) {
  const [cate, subCate, brand] = await Promise.all([
    db.category.findUnique({ where: { id: cateId } }),
    db.category.findUnique({ where: { id: subCateId } }),
    db.brand.findUnique({
      where: { id: brandId },
    }),
  ])

  return {
    isCateValid: !!cate,
    isSubCateValid: !!subCate,
    isBrandValid: !!brand,
  }
}

async function validateImportTechnicalDetail(
  productId,
  filterId,
  filterValueId
) {
  const [product, filter, filterValue] = await Promise.all([
    db.product.findUnique({ where: { id: productId } }),
    db.filter.findUnique({ where: { id: filterId } }),
    db.filter_value.findUnique({ where: { id: filterValueId } }),
  ])

  return {
    isProductValid: !!product,
    isFilterValid: !!filter,
    isFilterValueValid: !!filterValue,
  }
}

async function validateImportSaleDetail(productId) {
  const [product] = await Promise.all([
    db.product.findUnique({ where: { id: productId } }),
  ])

  return {
    isProductValid: !!product,
  }
}

async function importProduct(worksheet) {
  const requiredColumnIndexes = {
    productId: 0,
    name: 1,
    categoryId: 2,
    subCategoryId: 3,
    brandId: 4,
    active: 7,
  }

  for (const [index, row] of worksheet.entries()) {
    const rowData = Object.values(row)

    const isAllRequiredData = Object.values(requiredColumnIndexes).every(
      (colIndex) =>
        rowData[colIndex] !== undefined &&
        rowData[colIndex] !== null &&
        rowData[colIndex] !== ""
    )

    if (!isAllRequiredData) {
      throw new Error(
        `"Line ${index + 1}": ${IMPORT_MESSAGE.MISSING_REQUIRED_DATA}`
      )
    }

    const productId = rowData[requiredColumnIndexes.productId]
    const name = rowData[requiredColumnIndexes.name]
    const categoryId = rowData[requiredColumnIndexes.categoryId]
    const subCategoryId = rowData[requiredColumnIndexes.subCategoryId]
    const brandId = rowData[requiredColumnIndexes.brandId]
    const active = rowData[requiredColumnIndexes.active]

    if (!isAllRequiredData) {
      throw new Error(
        `"Line ${index + 1}": ${IMPORT_MESSAGE.MISSING_REQUIRED_DATA}`
      )
    }
    if (
      !isValidUUID(productId) ||
      !isValidUUID(categoryId) ||
      !isValidUUID(subCategoryId) ||
      !isValidUUID(brandId)
    ) {
      throw new Error(
        `"Line ${index + 1}": ${IMPORT_MESSAGE.INVALID_UUID_FORMAT}`
      )
    }

    const { isCateValid, isSubCateValid, isBrandValid } = await validateProduct(
      categoryId,
      subCategoryId,
      brandId
    )

    if (!isCateValid) {
      throw new Error(
        `"Line ${index + 1}": ${IMPORT_MESSAGE.CATEGORY_NOT_FOUND}`
      )
    }

    if (!isSubCateValid) {
      throw new Error(
        `"Line ${index + 1}": ${IMPORT_MESSAGE.SUB_CATEGORY_NOT_FOUND}`
      )
    }

    if (!isBrandValid) {
      throw new Error(`"Line ${index + 1}": ${IMPORT_MESSAGE.BRAND_NOT_FOUND}`)
    }

    const slug = name
      .toString()
      .toLowerCase()
      .trim()
      .replace(/[\s\W-]+/g, "-")

    const isExisting = await db.product.findUnique({
      where: { id: productId },
    })

    const metaTitle = rowData[5]
    const metaDescription = rowData[6]

    const dataObj = {
      name: name,
      slug: slug,
      metaTitle: metaTitle || null,
      metaDescription: metaDescription || null,
      active: active === "T",
      category: {
        connect: { id: categoryId },
      },
      subCate: {
        connect: { id: subCategoryId },
      },
      brand: {
        connect: { id: brandId },
      },
    }

    try {
      if (isExisting) {
        await db.product.update({
          where: { id: productId },
          data: dataObj,
        })
      } else {
        await db.product.create({
          data: {
            id: productId,
            ...dataObj,
          },
        })
      }
    } catch (error) {
      console.log(error)
      throw new Error(IMPORT_MESSAGE.DATABASE_ERROR)
    }
  }

  return { success: true }
}

async function importTechnicalDetail(worksheet) {
  const requiredColumnIndexes = {
    productId: 0,
    filterId: 1,
    filterValueId: 2,
  }

  for (const [index, row] of worksheet.entries()) {
    const rowData = Object.values(row)

    const isAllRequiredData = Object.values(requiredColumnIndexes).every(
      (colIndex) =>
        rowData[colIndex] !== undefined &&
        rowData[colIndex] !== null &&
        rowData[colIndex] !== ""
    )

    if (!isAllRequiredData) {
      throw new Error(
        `"Line ${index + 1}": ${IMPORT_MESSAGE.MISSING_REQUIRED_DATA}`
      )
    }

    const productId = rowData[requiredColumnIndexes.productId]
    const filterId = rowData[requiredColumnIndexes.filterId]
    const filterValueId = rowData[requiredColumnIndexes.filterValueId]

    if (
      !isValidUUID(productId) ||
      !isValidUUID(filterId) ||
      !isValidUUID(filterValueId)
    ) {
      throw new Error(
        `"Line ${index + 1}": ${IMPORT_MESSAGE.INVALID_UUID_FORMAT}`
      )
    }

    const { isProductValid, isFilterValid, isFilterValueValid } =
      await validateImportTechnicalDetail(productId, filterId, filterValueId)

    if (!isProductValid) {
      throw new Error(
        `"Line ${index + 1}": ${IMPORT_MESSAGE.PRODUCT_NOT_FOUND}`
      )
    }

    if (!isFilterValid) {
      throw new Error(`"Line ${index + 1}": ${IMPORT_MESSAGE.FILTER_NOT_FOUND}`)
    }

    if (!isFilterValueValid) {
      throw new Error(
        `"Line ${index + 1}": ${IMPORT_MESSAGE.FILTER_VALUE_NOT_FOUND}`
      )
    }

    const existingRecord = await db.technical_detail.findFirst({
      where: {
        productId: productId,
        filterId: filterId,
        filterValueId: filterValueId,
      },
    })

    if (existingRecord) {
      throw new Error(
        `"Line ${index + 1}": ${IMPORT_MESSAGE.RECORD_ALREADY_EXISTS}`
      )
    }

    const dataObj = {
      product: {
        connect: { id: productId },
      },
      filter: {
        connect: { id: filterId },
      },
      filterValue: {
        connect: { id: filterValueId },
      },
    }

    try {
      await db.technical_detail.create({
        data: dataObj,
      })
    } catch (error) {
      console.log(error)
      throw new Error(IMPORT_MESSAGE.DATABASE_ERROR)
    }
  }

  return { success: true }
}

async function importSaleDetail(worksheet) {
  const requiredColumnIndexes = {
    productId: 0,
    sku: 1,
    price: 2,
    showPrice: 4,
    inStock: 7,
  }

  for (const [index, row] of worksheet.entries()) {
    const rowData = Object.values(row)
    const isAllRequiredData = Object.values(requiredColumnIndexes).every(
      (colIndex) =>
        rowData[colIndex] !== undefined &&
        rowData[colIndex] !== null &&
        rowData[colIndex] !== ""
    )

    if (!isAllRequiredData) {
      throw new Error(
        `"Line ${index + 1}": ${IMPORT_MESSAGE.MISSING_REQUIRED_DATA}`
      )
    }

    const productId = rowData[requiredColumnIndexes.productId]
    const sku = rowData[requiredColumnIndexes.sku]
    const price = rowData[requiredColumnIndexes.price]
    const showPrice = rowData[requiredColumnIndexes.showPrice]
    const inStock = rowData[requiredColumnIndexes.inStock]

    if (!isValidUUID(productId)) {
      throw new Error(
        `"Line ${index + 1}": ${IMPORT_MESSAGE.INVALID_UUID_FORMAT}`
      )
    }

    const { isProductValid } = await validateImportSaleDetail(productId)

    if (!isProductValid) {
      throw new Error(
        `"Line ${index + 1}": ${IMPORT_MESSAGE.PRODUCT_NOT_FOUND}`
      )
    }

    const filterId = rowData[5]
    const filterValueId = rowData[6]

    if (filterId) {
      if (!isValidUUID(filterId)) {
        throw new Error(
          `"Line ${index + 1}": ${IMPORT_MESSAGE.INVALID_UUID_FORMAT}`
        )
      }

      const filter = await db.filter.findUnique({
        where: { id: filterId },
      })

      if (!filter) {
        throw new Error(
          `"Line ${index + 1}": ${IMPORT_MESSAGE.FILTER_VALUE_NOT_FOUND}`
        )
      }
    }

    if (filterValueId) {
      if (!isValidUUID(filterValueId)) {
        throw new Error(
          `"Line ${index + 1}": ${IMPORT_MESSAGE.INVALID_UUID_FORMAT}`
        )
      }
      const filterValue = await db.filter_value.findUnique({
        where: { id: filterValueId },
      })

      if (!filterValue) {
        throw new Error(
          `"Line ${index + 1}": ${IMPORT_MESSAGE.FILTER_VALUE_NOT_FOUND}`
        )
      }
    }

    const dataObj = {
      sku: sku,
      price: price,
      promotionalPrice: showPrice === "T" ? null : rowData[3],
      showPrice: showPrice === "T",
      product: {
        connect: { id: productId },
      },
      inStock: inStock,
    }

    if (filterId) {
      dataObj.filter = {
        connect: { id: filterId },
      }
    }

    if (filterValueId) {
      dataObj.filterValue = {
        connect: { id: filterValueId },
      }
    }

    try {
      await db.sale_detail.create({
        data: dataObj,
      })
    } catch (error) {
      console.log(error)
      throw new Error(IMPORT_MESSAGE.DATABASE_ERROR)
    }
  }

  return { success: true }
}

async function saveImportHistory(data, method) {
  const baseUrl = process.env.NEXT_PUBLIC_DOMAIN || "http://localhost:3000"
  const response = await fetch(`${baseUrl}/api/history`, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
  return response.json()
}

export async function POST(req) {
  const url = new URL(req.url)
  const searchParams = url.searchParams
  let type = searchParams.get("type") || ""

  let status = history_status.PROCESSING
  let fileName = ""
  let history_id
  let isSuccess = false

  try {
    const formData = await req.formData()
    const file = formData.get("file")
    fileName = file.name

    const { id } = await saveImportHistory(
      {
        fileName,
        status,
      },
      "POST"
    )

    history_id = id

    const arrayBuffer = await file.arrayBuffer()
    const buffer = new Uint8Array(arrayBuffer)
    const workbook = XLSX.read(buffer)

    const sheetName = workbook.SheetNames[0]
    const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
      defval: null,
      raw: true,
    })

    switch (type) {
      case "product":
        await importProduct(worksheet)
        break
      case "technical_detail":
        await importTechnicalDetail(worksheet)
        break
      case "sale_detail":
        await importSaleDetail(worksheet)
        break
      default:
        throw new Error(IMPORT_MESSAGE.INVALID_IMPORT_TYPE)
    }

    isSuccess = true

    return NextResponse.json(
      { message: IMPORT_MESSAGE.IMPORT_SUCCESS },
      { status: 200 }
    )
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { message: error.message || IMPORT_MESSAGE.IMPORT_FAILED },
      { status: error.message ? 400 : 500 }
    )
  } finally {
    status = isSuccess ? history_status.PROCESSED : history_status.ERROR

    await saveImportHistory(
      {
        fileName,
        status,
        id: history_id,
      },
      "PATCH"
    )
  }
}
