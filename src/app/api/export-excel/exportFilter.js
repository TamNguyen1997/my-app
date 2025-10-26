import { db } from "@/app/db";
import * as XLSX from "xlsx";

export const extractFilterData = async () => {
  const result = await db.filter.findMany({
    orderBy: {
      updatedAt: "desc",
    },
    select: {
      id: true,
      name: true,
      active: true,
    },
  });

  const headers = [
    "ID",
    "Tên",
    "active",
  ];

  const data = result.map((el) => ({
    ID: el.id,
    name: el.name,
    active: el.active ? "T" : "F",
  }));

  return XLSX.utils.json_to_sheet(data, { header: headers });
}


