import { db } from '@/app/db';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  if (!params.slug) {
    return NextResponse.json({ message: `Resource not found ${params.slug}` }, { status: 400 })
  }
  try {
    const category = await db.category.findFirst({ where: { slug: params.slug } })

    if (!category) {
      return NextResponse.json({ message: "No category found" }, { status: 404 })
    }

    const categoriesToProducts = await db.categories_to_products.findMany({
      where: { categoryId: category.id }, include: {
        product: {
          include: { image: true }
        }
      }
    })
    const products = categoriesToProducts.map(item => item.product)
    return NextResponse.json({
      category: category,
      products: products
    })
  } catch (e) {
    console.log(e)
    return NextResponse.json({ message: "Something went wrong", error: e }, { status: 400 })
  }
}