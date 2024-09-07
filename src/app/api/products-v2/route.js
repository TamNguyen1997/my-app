import { db } from "@/app/db"
import { NextResponse } from "next/server"
import { PRODUCT_MESSAGE } from "@/constants/message"

export async function GET(req) {
  const url = new URL(req.url)
  const searchParams = url.searchParams

  let page = Math.max(1, +searchParams.get("page"))
  let limit = Math.max(1, +searchParams.get("limit") || 10)

  try {
    const totalCount = await db.product.count()
    const totalPages = Math.ceil(totalCount / limit)

    if (page > totalPages) {
      page = totalPages
    }

    const skip = (page - 1) * limit

    const result = await db.product.findMany({
      take: limit,
      skip,
      orderBy: {
        updatedAt: "desc",
      },
      select: {
        id: true,
        name: true,
        categoryId: true,
        subCateId: true,
        brandId: true,
        metaTitle: true,
        metaDescription: true,
        active: true,
        updatedAt: true,
      },
    })

    return NextResponse.json(
      {
        data: result,
        currentPage: page,
        totalPages,
        totalCount,
        message: PRODUCT_MESSAGE.PRODUCT_FETCH_SUCCESS,
      },
      { status: 200 }
    )
  } catch (error) {
    console.log(error)

    return NextResponse.json(
      { message: PRODUCT_MESSAGE.PRODUCT_FETCH_FAILED },
      { status: 500 }
    )
  }
}
