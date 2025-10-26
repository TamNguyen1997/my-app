import { db } from "@/app/db";
import * as XLSX from "xlsx";

export const extractCategoryOnFilterValueData = async () => {
  // Step 1: read link rows
  const links = await db.category_on_filter_value.findMany({
    orderBy: [
      { categoryId: "asc" },
      { filterValueId: "asc" },
    ],
    select: {
      categoryId: true,
      filterValueId: true,
    },
  })

  if (!links.length) {
    const headers = [
      "ID Filter",
      "Tên Filter",
      "ID giá trị filter",
      "Giá trị filter",
      "ID category/sub-category",
    ];
    return XLSX.utils.json_to_sheet([], { header: headers })
  }

  // Step 2: fetch filter values
  const filterValueIds = Array.from(new Set(links.map((l) => l.filterValueId)))
  const filterValues = await db.filter_value.findMany({
    where: { id: { in: filterValueIds } },
    select: { id: true, value: true, filterId: true },
  })
  const fvMap = new Map(filterValues.map((fv) => [fv.id, fv]))

  // Step 3: fetch filters
  const filterIds = Array.from(
    new Set(filterValues.map((fv) => fv.filterId).filter(Boolean))
  )
  const filters = await db.filter.findMany({
    where: { id: { in: filterIds } },
    select: { id: true, name: true },
  })
  const filterMap = new Map(filters.map((f) => [f.id, f.name]))

  const headers = [
    "ID Filter",
    "Tên Filter",
    "ID giá trị filter",
    "Giá trị filter",
    "ID category/sub-category",
  ]

  const data = links.map((link) => {
    const fv = fvMap.get(link.filterValueId)
    const filterId = fv?.filterId || ""
    const filterName = filterId ? filterMap.get(filterId) || "" : ""
    return {
      "ID Filter": filterId,
      "Tên Filter": filterName,
      "ID giá trị filter": link.filterValueId,
      "Giá trị filter": fv?.value || "",
      "ID category/sub-category": link.categoryId,
    }
  })

  return XLSX.utils.json_to_sheet(data, { header: headers });
}


