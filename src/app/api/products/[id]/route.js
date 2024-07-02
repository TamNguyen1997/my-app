import { db } from '@/app/db';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  if (!params.id) {
    return NextResponse.json({ message: `Resource not found ${params.id}` }, { status: 400 })
  }
  try {

    const { searchParams } = new URL(req.url);

    return NextResponse.json(await db.product.findFirst(
      {
        where: { id: params.id },
        include: {
          technical_detail: searchParams && searchParams.get("includeTechnical") !== "undefined" && searchParams.get("includeTechnical") !== null,
          saleDetails: searchParams && searchParams.get("includeSale") !== "undefined" && searchParams.get("includeSale") !== null,
          image: true
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

  if (!body) return NextResponse.json({ message: "Invalid request body" }, { status: 400 })
  try {
    await db.product.update({ where: { id: params.id }, data: body })
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
    await db.categories_to_products.deleteMany({ where: { productId: params.id } })
    await db.technical_detail.deleteMany({ where: { productId: params.id } })
    return NextResponse.json(await db.product.delete({ where: { id: params.id } }))
  } catch (e) {
    return NextResponse.json({ message: "Something went wrong", error: e }, { status: 400 })
  }
}
