import { NextResponse } from 'next/server';
import { db } from '@/app/db';

export async function GET(req) {

  try {
    return NextResponse.json(await db.category.findMany({
      include: {
        _count: {
          select: { product: true },
        },
      },
      orderBy: {
        product: {
          _count: 'desc'
        }
      },
      take: 3
    }))
  } catch (e) {
    return NextResponse.json({ message: "Something went wrong", error: e }, { status: 400 })
  }
}