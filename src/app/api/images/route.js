import { NextResponse } from 'next/server'
import { db } from '@/app/db';
import queryString from 'query-string';

export async function GET(req) {
  const { query } = queryString.parseUrl(req.url);

  let page = 1
  let size = 10

  let condition = {}

  if (query) {
    page = parseInt(query.page) || 1
    size = parseInt(query.size) || 10
  }
  if (query.type && query.type !== "undefined") {
    condition.type = query.type
  }

  if (query.name && query.name !== "undefined") {
    condition.name = { search: `${query.name}:*` }
  }

  try {
    return NextResponse.json({
      result: await db.image.findMany({
        where: condition,
        take: size,
        skip: (page - 1) * size,
        orderBy: { createdAt: 'desc' }
      }),
      total: await db.image.count({ where: condition })
    })
  } catch (e) {
    return NextResponse.json([])
  }
}