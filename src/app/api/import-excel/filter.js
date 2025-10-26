import { db } from "@/app/db"
import { IMPORT_MESSAGE } from "@/constants/message"

export async function importFilter(worksheet) {
  const requiredColumnIndexes = {
    id: 0,
    name: 1,
    active: 2,
  }

  await db.$transaction(async (tx) => {
    for (const [index, row] of worksheet.entries()) {
      const rowData = Object.values(row)

      const id = (rowData[requiredColumnIndexes.id] || "").toString()
      const name = (rowData[requiredColumnIndexes.name] || "").toString()
      const activeRaw = rowData[requiredColumnIndexes.active]

      if (!id || !name || activeRaw === undefined || activeRaw === null || activeRaw === "") {
        throw new Error(`"Line ${index + 1}": ${IMPORT_MESSAGE.MISSING_REQUIRED_DATA}`)
      }

      const active = String(activeRaw).trim().toUpperCase() === "T"

      try {
        await tx.filter.upsert({
          where: { id },
          update: {
            name,
            active,
          },
          create: {
            id,
            name,
            active,
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


