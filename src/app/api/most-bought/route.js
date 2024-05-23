import { db } from '@/app/db';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    const groupBy = await db.order_history.groupBy({
      by: ['productId'],
      _count: {
        productId: true,
      },
      orderBy: {
        _count: {
          productId: 'desc',
        },
      },
      take: 6
    })
    const ids = groupBy.map(item => item.productId)
    return NextResponse.json(await db.product.findMany({
      where: { id: { in: ids } }
    }))
  } catch (e) {
    return NextResponse.json({ message: "Something went wrong", error: e }, { status: 400 })
  }
}