import { db } from "@/app/db"
import { IMPORT_MESSAGE } from "@/constants/message"
import slugify from "slugify"
import { v4 } from "uuid"

export async function importCategoryOnFilterValue(worksheet) {
  // Expected columns by index based on exporter:
  // 0: ID Filter, 1: Tên Filter (ignored), 2: ID giá trị filter, 3: Giá trị filter, 4: ID category/sub-category
  const requiredColumnIndexes = {
    filterId: 0,
    filterValueId: 2,
    filterValue: 3,
    categoryId: 4,
  }

  await db.$transaction(async (tx) => {
    for (const [index, row] of worksheet.entries()) {
      // process all rows
      const rowData = Object.values(row)

      const filterId = (rowData[requiredColumnIndexes.filterId] || "").toString()
      const filterValueId = (rowData[requiredColumnIndexes.filterValueId] || "").toString() || v4()
      const filterValue = (rowData[requiredColumnIndexes.filterValue] || "").toString()
      const categoryId = (rowData[requiredColumnIndexes.categoryId] || "").toString()

      const hasAll = filterId && filterValueId && filterValue && categoryId
      if (!hasAll) {
        throw new Error(`"Line ${index + 1}": ${IMPORT_MESSAGE.MISSING_REQUIRED_DATA}`)
      }

      // Validate referenced entities
      const [filter, category, filterValueData] = await Promise.all([
        tx.filter.findUnique({ where: { id: filterId } }),
        tx.category.findUnique({ where: { id: categoryId } }),
      ])

      if (!filter) {
        throw new Error(`"Line ${index + 1}": ${IMPORT_MESSAGE.FILTER_NOT_FOUND}`)
      }
      if (!category) {
        throw new Error(`"Line ${index + 1}": ${IMPORT_MESSAGE.CATEGORY_NOT_FOUND}`)
      }
      if (filterValueId) {
        const filterValueData = await tx.filter_value.findFirst({ where: { id: filterValueId } })
        if (filterValueData?.filterId !== filterId) {
          throw new Error(`"Line ${index + 1}": ${IMPORT_MESSAGE.FILTER_NOT_MATCH}`)
        }
      }

      const slug = slugify(filterValue, { locale: 'vi' }).replaceAll("(", "").replaceAll(")", "").toLowerCase()

      try {
        // Upsert filter_value by ID
        await tx.filter_value.upsert({
          where: { id: filterValueId },
          update: {
            value: filterValue,
            slug: slug,
            filter: { connect: { id: filterId } },
          },
          create: {
            id: filterValueId,
            value: filterValue,
            slug: slug,
            filter: { connect: { id: filterId } },
          },
        })

        // Link category and filter value (upsert on composite key)
        await tx.category_on_filter_value.upsert({
          where: {
            categoryId_filterValueId: {
              categoryId: categoryId,
              filterValueId: filterValueId,
            },
          },
          update: {},
          create: {
            category: { connect: { id: categoryId } },
            filterValue: { connect: { id: filterValueId } },
          },
        })
      } catch (error) {
        console.log(error)
        throw new Error(IMPORT_MESSAGE.DATABASE_ERROR)
      }
    }
  })

  return { success: true }
}


