import { NextResponse } from 'next/server';
import { db } from '@/app/db';
import queryString from 'query-string';
import { cate_type } from '@prisma/client';

export async function GET(req) {
  let condition = {}
  let include = { image: true }
  let size = 10
  let page = 1
  const { query } = queryString.parseUrl(req.url);

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

  if (query.type) {
    condition.type = query.type
  }

  if (query.active) {
    condition.active = query.active === "true"
  }

  if (query.includeSubCate) {
    include.subcates = {
      include: {
        image: true
      }
    }
  }

  if (query.includeImage) {
    include.image = query.includeImage === 'true'
  }

  if (query.includeParentCategory) {
    include.cate = query.includeParentCategory === 'true'
  }

  if (query.showOnHeader) {
    condition.showOnHeader = query.showOnHeader === 'true'
  }

  if (query.highlight) {
    condition.highlight = query.highlight === 'true'
  }

  try {
    const result = await db.category.findMany({
      where: condition,
      orderBy: [
        {
          updatedAt: "desc"
        }
      ],
      take: size,
      skip: (page - 1) * size,
      include: include
    })

    return NextResponse.json({ result, total: await db.category.count({ where: condition }) })
  } catch (e) {
    return NextResponse.json({ message: "Something went wrong", error: e }, { status: 400 })
  }
}

export async function POST(req) {
  let body = await req.json()
  delete body.image
  delete body.subCategory

  const highlightedCates = await db.category.findMany({
    where: {
      highlight: true,
      type: cate_type.CATE
    }
  })

  if (highlightedCates.length === 3 && body.highlight) {
    return NextResponse.json({ message: "Tối đa 3 category nổi bật" }, { status: 400 })
  }

  return NextResponse.json(await db.category.create(
    {
      data: body
    }
  ))
}