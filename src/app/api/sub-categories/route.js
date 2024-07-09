import { NextResponse } from 'next/server';
import { db } from '@/app/db';
import queryString from 'query-string';

export async function GET(req) {
  let condition = {}
  let size = 10
  let page = 1

  const { query } = queryString.parseUrl(req.url);

  if (query.type) {
    condition.type = query.type
  }

  if (query) {
    page = parseInt(query.page) || 1
    size = parseInt(query.size) || 10
  }

  if (query.slug) {
    condition.slug = {
      search: `${query.slug.trim().replaceAll(" ", " & ")}:*`
    }
  }

  if (query.name) {
    condition.name = {
      search: `${query.name.trim().replaceAll(" ", " & ")}:*`
    }
  }

  try {
    const result = await db.sub_category.findMany({
      where: condition,
      orderBy: [
        {
          updatedAt: "desc"
        }
      ],
      take: size,
      skip: (page - 1) * size,
    })
    return NextResponse.json({ result, total: await db.sub_category.count({ where: condition }) })
  } catch (e) {
    console.log(e)
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