import { db } from '@/app/db';
import { NextResponse } from 'next/server';
import queryString from 'query-string';

export async function POST(req) {
  try {
    const body = await req.json()
    if (body.id) return NextResponse.json(await db.blog.update({ where: { id: body.id }, data: body }))

    return NextResponse.json(await db.blog.create({ data: body }))
  } catch (e) {
    return NextResponse.json({ message: "Something went wrong", error: e }, { status: 400 })
  }
}

export async function GET(req) {
  try {
    let page = 1
    let size = 10

    const { query } = queryString.parseUrl(req.url);

    let condition = {}

    if (query) {
      page = parseInt(query.page) || 1
      size = parseInt(query.size) || 10
    }
    if (query.excludeSupport) {
      condition.NOT = [{
        slug: {
          in: ["ho-tro", "chinh-sach-bao-mat", "hop-tac-ban-hang", "chinh-sach-doi-tra", "chinh-sach-bao-hanh", "huong-dan-mua-hang", "hinh-thuc-thanh-toan", "hinh-thuc-van-chuyen"]
        }
      }
      ]
    }

    if (query.active) {
      condition.active = query.active === 'true'
    }
    if (query.blogCategory) {
      condition.blogCategory = query.blogCategory
    }

    if (query.blogSubCategory) {
      condition.blogSubCategory = query.blogSubCategory
    }

    if (query.slug) {
      condition.slug = {
        search: `${query.slug.trim().replaceAll(" ", " & ")}:*`
      }
    }

    const result = await db.blog.findMany({
      where: condition,
      take: size,
      skip: (page - 1) * size
    })
    return NextResponse.json({
      result,
      total: await db.blog.count({ where: condition })
    })
  } catch (e) {
    console.log(e)
    return NextResponse.json({ message: "Something went wrong", error: e }, { status: 400 })
  }
}