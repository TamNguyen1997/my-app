import { db } from '@/app/db';
import { NextResponse } from 'next/server';

export async function POST(req, { params }) {
  try {
    let body = await req.json()
    await db.sale_detail.deleteMany({
      where: {
        productId: params.id,
        NOT: {
          parentSaleDetailId: null
        }
      }
    })
    await db.sale_detail.deleteMany({
      where: {
        productId: params.id
      }
    })
    await db.sale_detail.createMany({
      data: body
    })
    return NextResponse.json({ message: "Success" })
  } catch (e) {
    return NextResponse.json({ message: "Something went wrong", error: e }, { status: 400 })
  }
}

export async function GET(req, { params }) {
  if (!params.id) {
    return NextResponse.json({ message: `Resource not found ${params.id}` }, { status: 400 })
  }

  try {
    const result = await db.sale_detail.findMany({ where: { productId: params.id } })
    return NextResponse.json(result)
  } catch (e) {
    return NextResponse.json({ message: "Something went wrong", error: e }, { status: 400 })
  }
}
