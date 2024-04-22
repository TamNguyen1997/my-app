import { db } from '@/app/db';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  if (!params.id) {
    return NextResponse.json({ message: `Resource not found ${params.id}` }, { status: 400 })
  }
  try {
    return NextResponse.json(await db.primary_sale_detail.findMany(
      {
        where: { productId: params.id },
        include: { secondary_sale_detail: true }
      }
    ))
  } catch (e) {
    return NextResponse.json([])
  }
}

export async function POST(req, { params }) {
  if (!params.id) {
    return NextResponse.json({ message: `Resource not found ${params.id}` }, { status: 400 })
  }
  try {
    const body = await req.json()
    const secondaryDetails = []
    const primaryDetails = []
    const primaryIds = []

    body.forEach(detail => {
      secondaryDetails.push(...detail.secondary_sale_detail)      
      delete detail["secondary_sale_detail"]
      primaryIds.push(detail.id)
      primaryDetails.push(detail)
    })

    await db.secondary_sale_detail.deleteMany({ where: { primarySaleDetailId: { in: primaryIds } } })
    await db.primary_sale_detail.deleteMany({ where: { id: { in: primaryIds } } })

    await db.primary_sale_detail.createMany({ data: primaryDetails })

    if (secondaryDetails.length) await db.secondary_sale_detail.createMany({ data: secondaryDetails })

    return NextResponse.json({})
  } catch (e) {
    console.log(e)
    return NextResponse.json([])
  }
}