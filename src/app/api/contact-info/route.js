import { NextResponse } from 'next/server';
import { db } from '@/app/db';
import queryString from 'query-string';

export async function GET(req) {
  let page = 1
  let size = 10
  const { query } = queryString.parseUrl(req.url);
  let condition = {}
  if (query) {
    page = parseInt(query.page) || 1
    size = parseInt(query.size) || 10

    if (query.phone) {
      condition.highlight = query.phone
    }
    if (query.email) {
      condition.email = query.email
    }
    if (query.name) {
      condition.name = query.name
    }
  }
  try {
    const result = await db.contact_info.findMany({
      where: condition,
      orderBy: [
        {
          updatedAt: "desc"
        }
      ],
      take: size,
      skip: (page - 1) * size
    })
    return NextResponse.json({ result, total: await db.contact_info.count({ where: condition }) })
  } catch (e) {
    return NextResponse.json({ message: "Something went wrong", error: e }, { status: 400 })
  }
}

export async function POST(req) {

  try {
    const body = await req.json()
    return NextResponse.json(await db.contact_info.create({
      data: body
    }))
  } catch (e) {
    return NextResponse.json({ message: "Something went wrong", error: e }, { status: 400 })
  }
}