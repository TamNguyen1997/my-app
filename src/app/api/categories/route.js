import { NextResponse } from 'next/server';
import { db } from '@/app/db';
import queryString from 'query-string';

export async function GET(req) {
  let condition = {}
  let include = {}
  const { query } = queryString.parseUrl(req.url);
  if (query.type) {
    condition.type = query.type
  }

  if (query.includeSubCate) {
    include.sub_category = query.includeSubCate === 'true'
  }

  try {
    return NextResponse.json(await db.category.findMany({
      where: condition,
      orderBy: [
        {
          updatedAt: "desc"
        }
      ],
      take: 7,
      include: include
    }))
  } catch (e) {
    return NextResponse.json({ message: "Something went wrong", error: e }, { status: 400 })
  }
}

export async function POST(req) {
  const body = await req.json()
  return NextResponse.json(await db.category.create(
    {
      data: body
    }
  ))
}