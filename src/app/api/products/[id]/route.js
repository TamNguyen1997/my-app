import { db } from '@/app/db';
import { NextResponse } from 'next/server';
import { parse } from 'uuid';

export async function GET(req, { params }) {
  if (!params.id) {
    return NextResponse.json({ message: `Resource not found ${params.id}` }, { status: 400 })
  }
  try {

    const { searchParams } = new URL(req.url);

    let condition = {}

    try {
      parse(params.id)
      condition = { id: params.id }
    } catch (e) {
      condition = { slug: params.id }
    }

    return NextResponse.json(await db.product.findFirst(
      {
        where: condition,
        include: {
          technical_detail: searchParams && searchParams.get("includeTechnical") !== "undefined" && searchParams.get("includeTechnical") !== null,
          saleDetails: searchParams && searchParams.get("includeSale") !== "undefined" && searchParams.get("includeSale") !== null,
          image: true,
          category: true,
          subCategory: true,
          brand: true
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

  delete body.saleDetails
  delete body.image
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
    await db.technical_detail.deleteMany({ where: { productId: params.id } })
    return NextResponse.json(await db.product.delete({ where: { id: params.id } }))
  } catch (e) {
    return NextResponse.json({ message: "Something went wrong", error: e }, { status: 400 })
  }
}
