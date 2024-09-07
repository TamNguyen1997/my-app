import { db } from "@/app/db"
import { NextResponse } from "next/server"
import { HISTORY_MESSAGE } from "@/constants/message"

export async function GET(req) {
  const url = new URL(req.url)
  const searchParams = url.searchParams

  let page = Math.max(1, +searchParams.get("page"))
  let limit = Math.max(1, +searchParams.get("limit") || 10)

  const search = searchParams.get("search") || ""
  const status = searchParams.get("status") || ""

  console.log(status)

  try {
    const whereClause = {}

    if (search && search !== "undefined") {
      whereClause.fileName = {
        contains: search,
        mode: "insensitive",
      }
    }

    if (status && status !== "undefined") {
      whereClause.status = status
    }

    const totalCount = await db.import_history.count({
      where: whereClause,
    })
    const totalPages = Math.ceil(totalCount / limit)

    if (page > totalPages) {
      page = totalPages
    }

    // const skip = (page - 1) * limit;
    const skip = Math.max((page - 1) * limit, 0)

    const result = await db.import_history.findMany({
      where: whereClause,
      take: limit,
      skip,
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(
      {
        data: result,
        currentPage: page,
        totalPages,
        totalCount,
        message: HISTORY_MESSAGE.HISTORY_FETCH_SUCCESS,
      },
      { status: 200 }
    )
  } catch (error) {
    console.log(error)

    return NextResponse.json(
      { message: HISTORY_MESSAGE.HISTORY_FETCH_FAILED },
      { status: 500 }
    )
  }
}

export async function POST(req) {
  try {
    const { fileName, status } = await req.json()

    const result = await db.import_history.create({
      data: {
        fileName,
        status,
      },
    })

    return NextResponse.json(
      {
        id: result.id,
        message: HISTORY_MESSAGE.HISTORY_SAVE_SUCCESS,
      },
      { status: 200 }
    )
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { message: HISTORY_MESSAGE.HISTORY_SAVE_FAILED },
      { status: 500 }
    )
  }
}

export async function PATCH(req) {
  try {
    const { fileName, status, id } = await req.json()

    const result = await db.import_history.update({
      where: { id },
      data: {
        fileName,
        status,
      },
    })

    return NextResponse.json(
      {
        id: result.id,
        message: HISTORY_MESSAGE.HISTORY_SAVE_SUCCESS,
      },
      { status: 200 }
    )
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { message: HISTORY_MESSAGE.HISTORY_SAVE_FAILED },
      { status: 500 }
    )
  }
}
