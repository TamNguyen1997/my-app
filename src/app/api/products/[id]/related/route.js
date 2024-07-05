import { db } from '@/app/db';
import { NextResponse } from 'next/server';
import queryString from 'query-string';

export async function GET(req, { params }) {
  if (!params.id) {
    return NextResponse.json({ message: `Resource not found ${params.id}` }, { status: 400 })
  }
  try {
    const { query } = queryString.parseUrl(req.url);
    if (query.active) {
      condition.active = query.active === 'true'
    }

    const product = await db.product.findFirst({ where: { id: params.id } })
    return NextResponse.json(await db.product.findMany(
      {
        where: {
          NOT: {
            id: params.id
          },
          categoryId: product.categoryId
        },
        include: {
          image: true
        },
        take: 4
      }
    ))
  } catch (e) {
    return NextResponse.json([])
  }
}