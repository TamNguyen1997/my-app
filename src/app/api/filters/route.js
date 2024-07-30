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
    return NextResponse.json({ message: "Something went wrong", error: e }, { status: 400 })
  }
}

export async function GET(req) {
  const { query } = queryString.parseUrl(req.url);
  let condition = {}

  if (query) {
    if (query.categoryId) {
      const category = await db.category.findFirst({ where: { slug: query.categoryId } })
      if (category) {
        condition.categoryId = category.id
      }
    }

    if (query.brandId) {
      const brand = await db.brand.findFirst({ where: { slug: query.brandId } })
      if (brand) {
        condition.brandId = brand.id
      }
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
