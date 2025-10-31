import { db } from "@/app/db";
import * as XLSX from "xlsx";

export const extractCategoryOnFilterValueData = async () => {
  // Step 1: fetch all filter values
  const filterValues = await db.filter_value.findMany({
    orderBy: [
      { filterId: "asc" },
      { id: "asc" },
    ],
    select: { id: true, value: true, filterId: true },
  })

  const headers = [
    "ID Filter",
    "Tên Filter",
    "ID giá trị filter",
    "Giá trị filter",
    "ID category",
  ]

  if (!filterValues.length) {
    return XLSX.utils.json_to_sheet([], { header: headers })
  }

  // Step 2: fetch filters for names
  const filterIds = Array.from(new Set(filterValues.map((fv) => fv.filterId).filter(Boolean)))
  const filters = filterIds.length
    ? await db.filter.findMany({ where: { id: { in: filterIds } }, select: { id: true, name: true } })
    : []
  const filterMap = new Map(filters.map((f) => [f.id, f.name]))

  // Step 3: fetch category links for these filter values
  const filterValueIds = filterValues.map((fv) => fv.id)
  const links = await db.category_on_filter_value.findMany({
    where: { filterValueId: { in: filterValueIds } },
    select: { categoryId: true, filterValueId: true },
  })
  const fvToCategories = new Map()
  for (const l of links) {
    const arr = fvToCategories.get(l.filterValueId) || []
    arr.push(l.categoryId)
    fvToCategories.set(l.filterValueId, arr)
  }

  // Step 4: resolve parent categories
  const allCategoryIds = Array.from(new Set(links.map((l) => l.categoryId)))
  const categories = allCategoryIds.length
    ? await db.category.findMany({ where: { id: { in: allCategoryIds } }, select: { id: true, cateId: true } })
    : []
  const categoryMap = new Map(categories.map((c) => [c.id, c]))

  // Step 5: build rows: one per filter_value per linked category; if none linked, one row with empty category
  const rows = []
  for (const fv of filterValues) {
    const filterId = fv.filterId || ""
    const filterName = filterId ? filterMap.get(filterId) || "" : ""
    const linked = fvToCategories.get(fv.id) || []
    if (linked.length === 0) {
      rows.push({
        "ID Filter": filterId,
        "Tên Filter": filterName,
        "ID giá trị filter": fv.id,
        "Giá trị filter": fv.value || "",
        "ID category": "",
      })
    } else {
      for (const catId of linked) {
        rows.push({
          "ID Filter": filterId,
          "Tên Filter": filterName,
          "ID giá trị filter": fv.id,
          "Giá trị filter": fv.value || "",
          "ID category": catId || "",
        })
      }
    }
  }

  return XLSX.utils.json_to_sheet(rows, { header: headers })
}


