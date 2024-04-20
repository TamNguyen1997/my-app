import { db } from '@/app/db';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    const popularProducts = await db.popular_product.findMany({})
    const ids = popularProducts.map(p => p.productId)
    return NextResponse.json(await db.product.findMany({
      where: {
        id: { in: ids }
      }
    }))
  } catch (e) {
    return NextResponse.json({ message: "Something went wrong", error: e }, { status: 400 })
  }
}