import * as XLSX from "xlsx"
import { db } from "@/app/db"
import { NextResponse } from "next/server"
import { history_status } from "@prisma/client"
import { IMPORT_MESSAGE } from "@/constants/message"
import slugify from "slugify"
import crypto from "crypto";

import { importTechnicalDetail } from "./technicalDetails"
import { importSaleDetail } from "./saleDetails"
import { importFilter } from "./filter"
import { importCategoryOnFilterValue } from "./categoryOnFilterValue"

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
    name: 1,
    categoryId: 2,
    subCategoryId: 3,
    brandId: 4,
    active: 7,
  }

  await db.$transaction(async tx => {
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

      const productId = (rowData[0] || crypto.randomBytes(3).toString("hex")).toString()
      const name = rowData[requiredColumnIndexes.name]
      const categoryId = rowData[requiredColumnIndexes.categoryId].toString()
      const subCategoryId = rowData[requiredColumnIndexes.subCategoryId].toString()
      const brandId = rowData[requiredColumnIndexes.brandId].toString()
      const active = rowData[requiredColumnIndexes.active]
      if (!isAllRequiredData) {
        throw new Error(
          `"Line ${index + 1}": ${IMPORT_MESSAGE.MISSING_REQUIRED_DATA}`
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

      const slug = slugify(name, { locale: 'vi' }).replaceAll("(", "").replaceAll(")", "").toLowerCase()

      const isExisting = await tx.product.findUnique({
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
          await tx.product.update({
            where: { id: productId },
            data: dataObj,
          })
        } else {
          await tx.product.create({
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
  })

  return { success: true }
}


async function saveImportHistory(data) {
  if (data.id) {
    return await db.import_history.update({ where: { id: data.id }, data: data })
  }
  return await db.import_history.create({ data: data })

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
      }
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
      case "filter":
        await importFilter(worksheet)
        break
      case "category_on_filter_value":
        await importCategoryOnFilterValue(worksheet)
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
      }
    )
  }
}
