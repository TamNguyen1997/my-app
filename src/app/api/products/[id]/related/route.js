import { db } from '@/app/db';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  if (!params.id) {
    return NextResponse.json({ message: `Resource not found ${params.id}` }, { status: 400 })
  }
  try {
    const product = await db.product.findFirst({where: {id: params.id}})
    return NextResponse.json(await db.product.findMany(
      {
        where: {
          NOT: {
            id: params.id
          },
          categoryId: product.categoryId
        },
        take: 4
      }
    ))
  } catch (e) {
    return NextResponse.json([])
  }
}