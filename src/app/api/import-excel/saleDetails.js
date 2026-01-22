import { db } from "@/app/db"
import { IMPORT_MESSAGE } from "@/constants/message"
import { v4 } from "uuid"

function toNonNegativeInt(value) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value < 0 ? 0 : Math.trunc(value)
  }
  if (typeof value === 'string') {
    const cleaned = value.replace(/[\,\s]/g, '').replace(/[^0-9\-\.]/g, '')
    const n = Number(cleaned)
    if (Number.isFinite(n)) {
      const intVal = Math.trunc(n)
      return intVal < 0 ? 0 : intVal
    }
  }
  return 0
}

async function importSaleDetail(worksheet) {
  const requiredColumnIndexes = {
    productId: 0,
    price: 2,
    showPrice: 4,
    inStock: 7,
  }

  const skuIndex = 1
  const promotionalPriceIndex = 3
  const parentSaleSkuColumnIndex = 8

  const CHUNK_SIZE = 200

  for (let offset = 0; offset < worksheet.length; offset += CHUNK_SIZE) {
    const chunk = worksheet.slice(offset, offset + CHUNK_SIZE)

    await db.$transaction(async tx => {
  for (let i = 0; i < chunk.length; i++) {
    const row = chunk[i]
    const index = offset + i
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

    const productId = rowData[requiredColumnIndexes.productId].toString()
    const sku = rowData[skuIndex]?.toString() || v4()
    const price = toNonNegativeInt(rowData[requiredColumnIndexes.price])
    const promotionalPrice = toNonNegativeInt(rowData[promotionalPriceIndex])
    const showPrice = rowData[requiredColumnIndexes.showPrice]
    const inStock = toNonNegativeInt(rowData[requiredColumnIndexes.inStock])
    const parentSaleDetailSku = rowData[parentSaleSkuColumnIndex]

    const product = await tx.product.findUnique({ where: { id: productId } })
    if (!product) {
      throw new Error(
        `"Line ${index + 1}": ${IMPORT_MESSAGE.PRODUCT_NOT_FOUND}`
      )
    }


    const dataObj = {
      sku: sku,
      price: price,
      promotionalPrice: promotionalPrice,
      showPrice: showPrice === "T",
      product: {
        connect: { id: productId },
      },
      inStock: inStock,
    }

    const filterId = rowData[5]
    const filterValueId = rowData[6]
    let filterRecord = null

    if (filterId) {
      const filter = await tx.filter.findFirst({
        where: { OR: [{id: filterId }, {displayId: filterId }] },
      })

      if (!filter) {
        throw new Error(
          `"Line ${index + 1}": ${IMPORT_MESSAGE.FILTER_VALUE_NOT_FOUND}`
        )
      }

      dataObj.filter = {
        connect: { id: filter.id },
      }
      filterRecord = filter
    }

    if (filterValueId) {
      const filterValue = await tx.filter_value.findFirst({
        where: { OR: [{id: filterValueId }, {displayId: filterValueId }] },
      })

      if (!filterValue) {
        throw new Error(
          `"Line ${index + 1}": ${IMPORT_MESSAGE.FILTER_VALUE_NOT_FOUND}`
        )
      }

      if (filterRecord && filterValue.filterId !== filterRecord.id) {
        throw new Error(
          `"Line ${index + 1}": Giá trị filter không khớp với filter đã chọn`
        )
      }

      dataObj.filterValue = {
        connect: { id: filterValue.id },
      }
    }

    if (parentSaleDetailSku) {
      const parentSaleDetail = await tx.sale_detail.findUnique({
        where: { sku: parentSaleDetailSku },
      })
      if (!parentSaleDetail) {
        throw new Error(
          `"Line ${index + 1}": Không tìm thấy sale detail với SKU "${parentSaleDetailSku}"`
        )
      }

      dataObj.saleDetail = {
        connect: { sku: parentSaleDetailSku },
      }
    }

    try {
      if (await tx.sale_detail.findUnique({ where: { sku: dataObj.sku } })) {
        await tx.sale_detail.update({ where: { sku: dataObj.sku }, data: dataObj })
      } else {
        await tx.sale_detail.create({ data: dataObj })
      }
    } catch (error) {
      console.error(`Error importing sale detail at line ${index + 1}`)
      throw new Error(IMPORT_MESSAGE.DATABASE_ERROR)
    }
  }
  }, { timeout: 120000, maxWait: 10000 })
  }

  return { success: true }
}

export { importSaleDetail }
