import { db } from '@/app/db';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  if (!params.id) {
    return NextResponse.json({ message: `Resource not found ${params.id}` }, { status: 400 })
  }
  try {
    return NextResponse.json(await db.product_on_image.findMany({ where: { productId: params.id }, include: { image: true } }))
  } catch (e) {
    return NextResponse.json([])
  }
}

export async function POST(req, { params }) {
  if (!params.id) {
    return NextResponse.json({ message: `Resource not found ${params.id}` }, { status: 400 })
  }
  const body = await req.json()
  if (!body.images) {
    return NextResponse.json({ message: "No images found" }, { status: 400 })
  }
  try {
    await db.product_on_image.deleteMany({ where: { productId: params.id } })
    const data = body.images.map(item => {
      return {
        productId: params.id,
        imageId: item.id
      }
    })

    await db.product_on_image.createMany({ data: data })
    return NextResponse.json({ message: "Success" })
  } catch (e) {
    return NextResponse.json([])
  }
}