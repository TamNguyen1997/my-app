import { db } from "@/app/db"
import { IMPORT_MESSAGE } from "@/constants/message"

export async function importFilter(worksheet) {
  const requiredColumnIndexes = {
    id: 0,
    name: 1,
    active: 2,
  }

  const CHUNK_SIZE = 500

  for (let offset = 0; offset < worksheet.length; offset += CHUNK_SIZE) {
    const chunk = worksheet.slice(offset, offset + CHUNK_SIZE)

    await db.$transaction(async (tx) => {
      for (let i = 0; i < chunk.length; i++) {
        const row = chunk[i]
        const index = offset + i

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
    }, { timeout: 120000, maxWait: 10000 })
  }

  return { success: true }
}


