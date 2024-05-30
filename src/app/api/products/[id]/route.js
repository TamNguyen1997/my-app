import { db } from '@/app/db';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  if (!params.id) {
    return NextResponse.json({ message: `Resource not found ${params.id}` }, { status: 400 })
  }
  try {
    return NextResponse.json(await db.product.findFirst(
      {
        where: { id: params.id },
        include: {
          technicalDetails: true,
          saleDetails: true
        }
      }
    ))
  } catch (e) {
    return NextResponse.json({ message: "Something went wrong", error: e }, { status: 400 })
  }
}

export async function PUT(req, { params }) {
  if (!params.id) {
    return NextResponse.json({ message: `Resource not found ${params.id}` }, { status: 400 })
  }

  let body = await req.json()
  const technicalDetails = body.technicalDetails
  const saleDetails = body.saleDetails

  delete body.technicalDetails
  delete body.saleDetails
  if (!body) return NextResponse.json({ message: "Invalid request body" }, { status: 400 })
  try {
    const tDetails = await db.technical_detail.findMany({ where: { productId: params.id } })
    await db.technical_detail.deleteMany({ where: { id: { in: tDetails.map(detail => detail.id) } } })

    const sDetails = await db.sale_detail.findMany({ where: { productId: params.id } })
    await db.sale_detail.deleteMany({ where: { id: { in: sDetails.filter(detail => detail.parentSaleDetailId !== null).map(detail => detail.id) } } })
    await db.sale_detail.deleteMany({ where: { id: { in: sDetails.map(detail => detail.id) } } })

    await db.product.update({ where: { id: params.id }, data: body })

    if (saleDetails) {
      await db.sale_detail.createMany({ data: saleDetails })
    }

    if (technicalDetails) {
      await db.technical_detail.createMany({ data: technicalDetails })
    }
    return NextResponse.json({ message: "Success" })
  } catch (e) {
    return NextResponse.json({ message: "Something went wrong", error: e }, { status: 400 })
  }
}

export async function DELETE(req, { params }) {
  if (!params.id) {
    return NextResponse.json({ message: `Resource not found ${params.id}` }, { status: 400 })
  }

  try {
    return NextResponse.json(await db.product.delete({ where: { id: params.id } }))
  } catch (e) {
    return NextResponse.json({ message: "Something went wrong", error: e }, { status: 400 })
  }
}