import { db } from '@/app/db';
import { NextResponse } from 'next/server';

export async function POST(req, { params }) {
  try {
    let body = await req.json()

    body.saleDetails.forEach(item => delete item.childSaleDetails)

    await db.$transaction(async (tx) => {
      // Find all existing sale_details we're about to delete
      const existingSaleDetails = await tx.sale_detail.findMany({
        where: { productId: params.id },
        select: { id: true }
      })
      const idsToDelete = existingSaleDetails.map(sd => sd.id)

      if (idsToDelete.length) {
        // Step 1: Detach children of rows being deleted
        await tx.sale_detail.updateMany({
          where: { saleDetailId: { in: idsToDelete } },
          data: { saleDetailId: null }
        })

        // Step 2: Detach product_on_order references
        await tx.product_on_order.updateMany({
          where: { saleDetailId: { in: idsToDelete } },
          data: { saleDetailId: null }
        })

        // Step 3: Delete filter_value_on_sale_detail
        await tx.filter_value_on_sale_detail.deleteMany({
          where: { saleDetailId: { in: idsToDelete } }
        })

        // Step 4: Delete the sale_details
        await tx.sale_detail.deleteMany({
          where: { productId: params.id }
        })
      }

      // Step 5: Create new sale_details
      await tx.sale_detail.createMany({
        data: body.saleDetails
      })
    })
    return NextResponse.json({ message: "Success" })
  } catch (e) {
    console.log(e)
    return NextResponse.json({ message: "Something went wrong", error: e }, { status: 400 })
  }
}

export async function GET(req, { params }) {
  if (!params.id) {
    return NextResponse.json({ message: `Resource not found ${params.id}` }, { status: 400 })
  }

  try {
    const result = await db.sale_detail.findMany({ where: { productId: params.id }, include: { childSaleDetails: true } })
    return NextResponse.json(result)
  } catch (e) {
    return NextResponse.json({ message: "Something went wrong", error: e }, { status: 400 })
  }
}
