import { db } from '@/app/db';
import { NextResponse } from 'next/server';
import queryString from 'query-string';

export async function POST(req) {
  try {
    const body = await req.json()
    return NextResponse.json(
      await db.filter_value.create(
        {
          data: body
        }
      )
    )
  } catch (e) {
    return NextResponse.json({ message: "Something went wrong", error: e }, { status: 400 })
  }
}

export async function GET(req, { params }) {
  let page = 1
  let size = 10
  try {
    const { query } = queryString.parseUrl(req.url);
    if (query) {
      page = parseInt(query.page) || 1
      size = parseInt(query.size) || 10
    }
    return NextResponse.json(
      await db.filter_value.findMany({
        include: {
          brands: true,
          categories: true,
          subCategories: true
        },
        take: size,
        skip: (page - 1) * size
      })
    )
  } catch (e) {
    return NextResponse.json({ message: "Something went wrong", error: e }, { status: 400 })
  }
}
