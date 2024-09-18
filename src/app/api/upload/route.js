import { NextResponse } from "next/server"
import { UPLOAD_MESSAGE } from "@/constants/message"

const MAX_FILE_SIZE_MB = 5

export async function POST(req) {
  // --------------------------------------------
  try {
    const formData = await req.formData()
    const file = formData.get("file")

    if (!file) {
      return NextResponse.json(
        { message: UPLOAD_MESSAGE.FILE_NOT_SELECTED },
        { status: 400 }
      )
    }

    // --------------------------------------------
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      return NextResponse.json(
        { message: UPLOAD_MESSAGE.FILE_TOO_LARGE },
        { status: 400 }
      )
    }

    // --------------------------------------------
    const fileName = file.name
    const ext = fileName.slice(fileName.lastIndexOf(".")).toLowerCase()

    if (ext !== ".xlsx" && ext !== ".xls") {
      return NextResponse.json(
        { message: UPLOAD_MESSAGE.INVALID_FILE_TYPE },
        { status: 400 }
      )
    }

    // --------------------------------------------

    return NextResponse.json(
      { message: UPLOAD_MESSAGE.FILE_UPLOAD_SUCCESS },
      { status: 200 }
    )
  } catch (error) {
    // --------------------------------------------
    console.log(error)
    return NextResponse.json(
      { message: UPLOAD_MESSAGE.FILE_UPLOAD_FAILED },
      { status: 500 }
    )
  }
}
