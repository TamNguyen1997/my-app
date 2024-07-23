import { db } from '@/app/db';
import { NextResponse } from 'next/server';
import queryString from 'query-string';

export async function POST(req) {
  try {
    const body = await req.json()
    return NextResponse.json(
      await db.filter.create(
        {
          data: body
        }
      )
    )
  } catch (e) {
    console.log(e)
    return NextResponse.json({ message: "Something went wrong", error: e }, { status: 400 })
  }
}

export async function GET(req) {
  const { query } = queryString.parseUrl(req.url);
  let condition = {}

  if (query) {
    if (query.categoryId) {
      condition.categoryId = query.categoryId
    }

    if (query.brandId) {
      condition.brandId = query.brandId
    }
  }

  try {
    const result = await db.filter.findMany({
      orderBy: [
        {
          updatedAt: "desc"
        }
      ],
      where: condition
    })

    return NextResponse.json({
      result, total: await db.filter.count({ where: condition })
    })
  } catch (e) {
    console.log(e)
    return NextResponse.json({ message: "Something went wrong", error: e }, { status: 400 })
  }
}
