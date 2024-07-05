import { NextResponse } from 'next/server';
import { db } from '@/app/db';
import queryString from 'query-string';

export async function GET(req) {
  let condition = {}

  const { query } = queryString.parseUrl(req.url);

  let take

  if (query.type) {
    condition.type = query.type
  }

  if (query.size) {
    take = parseInt(query.size)
  }

  try {
    return NextResponse.json(await db.sub_category.findMany({
      where: condition,
      orderBy: [
        {
          updatedAt: "desc"
        }
      ],
      take: take
    }))
  } catch (e) {
    return NextResponse.json({ message: "Something went wrong", error: e }, { status: 400 })
  }
}

export async function POST(req) {
  const body = await req.json()
  return NextResponse.json(await db.sub_category.create(
    {
      data: body
    }
  ))
}