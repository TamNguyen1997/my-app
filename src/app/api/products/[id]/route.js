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
  const categoryId = body.categoryId
  delete body.technicalDetails
  delete body.saleDetails
  delete body.categoryId

  if (!body) return NextResponse.json({ message: "Invalid request body" }, { status: 400 })
  try {
    await db.categories_to_products.deleteMany({ where: { productId: params.id } })
    await db.categories_to_products.create({ data: { productId: params.id, categoryId: categoryId } })
    await db.product.update({ where: { id: params.id }, data: body })
    return NextResponse.json({ message: "Success" })
  } catch (e) {
    console.log(e)
    return NextResponse.json({ message: "Something went wrong", error: e }, { status: 400 })
  }
}

export async function DELETE(req, { params }) {
  if (!params.id) {
    return NextResponse.json({ message: `Resource not found ${params.id}` }, { status: 400 })
  }

  try {
    await db.categories_to_products.deleteMany({ where: { productId: params.id } })
    return NextResponse.json(await db.product.delete({ where: { id: params.id } }))
  } catch (e) {
    return NextResponse.json({ message: "Something went wrong", error: e }, { status: 400 })
  }
}
