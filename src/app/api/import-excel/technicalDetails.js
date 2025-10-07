import { db } from "@/app/db"
import { IMPORT_MESSAGE } from "@/constants/message"

async function importTechnicalDetail(worksheet) {
  const requiredColumnIndexes = {
    sku: 0
  }

  for (const [index, row] of worksheet.entries()) {
    await db.$transaction(async tx => {
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

      const filterValueIds = rowData
        .slice(1)
        .filter(value => value !== null && value !== undefined && value !== "")
        .map(value => value.toString().trim())

      if (filterValueIds.length > 0) {
        const foundById = await tx.filter_value.findMany({
            where: { id: { in: filterValueIds } },
            select: { id: true, filterId: true },
          });

        const existing = new Set([
          ...foundById.map(item => item.id)
        ])

        const missing = filterValueIds.filter(value => !existing.has(value))

        if (missing.length > 0) {
          throw new Error(
            `"Line ${index + 1}": ${IMPORT_MESSAGE.FILTER_VALUE_NOT_FOUND}`
          )
        }
      }
    
      const sku = rowData[requiredColumnIndexes.sku].toString()
      const saleDetail = await tx.sale_detail.findFirst({
        where: {
          sku: sku,
        },
      })

      if (!saleDetail) {
        throw new Error(
          `"Line ${index + 1}": ${IMPORT_MESSAGE.TECHNICAL_DETAIL_NOT_FOUND}`
        )
      }

      try {
        const providedFilterValues = await tx.filter_value.findMany({
          where: { id: { in: filterValueIds } },
          select: { id: true, filterId: true },
        })

        // Preserve input order so earlier items update first (earliest updated_at)
        const byId = new Map(providedFilterValues.map(fv => [fv.id, fv]))
        const providedFilterValuesOrdered = filterValueIds.map(id => byId.get(id)).filter(Boolean)

        // Process sequentially in the given order
        for (const fv of providedFilterValuesOrdered) {
          const existingTechnical = await tx.filter_value_on_sale_detail.findFirst({
            where: {
              saleDetailId: saleDetail.id,
              filterValue: { filterId: fv.filterId },
            },
            select: { id: true },
          })

          if (existingTechnical) {
            await tx.filter_value_on_sale_detail.update({
              where: { id: existingTechnical.id },
              data: { filterValueId: fv.id },
            })
          } else {
            await tx.filter_value_on_sale_detail.create({
              data: {
                filterValueId: fv.id,
                saleDetailId: saleDetail.id,
              },
            })
          }
        }
      } catch (error) {
        console.log(error)
        throw new Error(IMPORT_MESSAGE.DATABASE_ERROR)
      }
    })
  }

  return { success: true }
}

export { importTechnicalDetail }