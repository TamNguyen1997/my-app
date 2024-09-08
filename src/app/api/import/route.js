import { NextResponse } from "next/server"
import fs from "node:fs/promises"
import { db } from "@/app/db"
import * as XLSX from "xlsx"

export async function POST(req) {
  try {
    let isInsertLog = false
    const formData = await req.formData()
    const file = formData.get("file")
    const arrayBuffer = await file.arrayBuffer()
    const buffer = new Uint8Array(arrayBuffer)
    const workbook = XLSX.read(buffer)
    let check = true
    let index = 2

    const data = workbook.Sheets[workbook.SheetNames[1]]
    while (check) {
      let idCol = `A${index}`
      let nameCol = `B${index}`
      let slugCol = `C${index}`
      let createdAtCol = `D${index}`
      let udpatedAtCol = `E${index}`
      let highlightCol = `F${index}`
      let showOnHeaderCol = `G${index}`
      if (data[idCol] == undefined) {
        check = false
        break
      }

      const slug = data[slugCol].v.toString()
      const categoryExist = await db.category.findUnique({
        where: { slug: slug },
      })
      if (categoryExist != null) {
        fs.appendFile(
          `./public/log/import-category.txt`,
          slug + "\n",
          function (err) {
            if (err) throw err
          }
        )
        isInsertLog = true
        index++
        continue
      }

      const category = {
        id: data[idCol].v,
        name: data[nameCol].v.toString(),
        slug: slug,
        highlight: data[highlightCol].v == "t",
        showOnHeader: data[showOnHeaderCol].v == "t",
      }

      await db.category.create({
        data: category,
      })

      index++
    }

    if (isInsertLog) {
      return NextResponse.json(
        { message: "Please check log/import-category.txt" },
        { status: 400 }
      )
    }
    return NextResponse.json({ message: "Import success" }, { status: 200 })
  } catch (e) {
    return NextResponse.json(
      { message: "Something went wrong", error: e },
      { status: 400 }
    )
  }
}
