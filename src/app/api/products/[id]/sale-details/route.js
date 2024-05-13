import { db } from '@/app/db';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    let body = await req.json()
    const ids = body.map(item => item.id)
    await db.sale_detail.delete({
      where: {
        id: {
          in: ids
        }
      }
    })
    await db.technical_detail.createMany({
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