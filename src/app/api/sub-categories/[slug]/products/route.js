import { db } from '@/app/db';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  if (!params.slug) {
    return NextResponse.json({ message: `Resource not found ${params.slug}` }, { status: 400 })
  }
  try {
    const sub_category = await db.sub_category.findFirst({ where: { slug: params.slug } })

    if (!sub_category) {
      return NextResponse.json({ message: "No sub_category found" }, { status: 404 })
    }

    const products = await db.products.findMany({
      where: {
        subCategoryId: sub_category.id
      }
    })
    return NextResponse.json(products)
  } catch (e) {
    return NextResponse.json({ message: "Something went wrong", error: e }, { status: 400 })
  }
}