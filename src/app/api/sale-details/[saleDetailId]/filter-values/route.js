import { NextResponse } from "next/server"
import { db } from "@/app/db"

export async function GET(req, { params }) {
  const { saleDetailId } = params
  const rows = await db.filter_value_on_sale_detail.findMany({
    where: { saleDetailId },
    include: { filterValue: { include: { filter: true } } }
  })
  return NextResponse.json(rows)
}

export async function PUT(req, { params }) {
  const { saleDetailId } = params
  const body = await req.json()
  const { filterValueIds } = body || {}

  if (!Array.isArray(filterValueIds)) {
    return NextResponse.json({ message: "filterValueIds must be an array" }, { status: 400 })
  }

  await db.$transaction(async (tx) => {
    await tx.filter_value_on_sale_detail.deleteMany({ where: { saleDetailId } })
    if (filterValueIds.length > 0) {
      await tx.filter_value_on_sale_detail.createMany({
        data: filterValueIds.map(id => ({ saleDetailId, filterValueId: id })),
        skipDuplicates: true,
      })
    }
  })

  return NextResponse.json({ success: true })
}


