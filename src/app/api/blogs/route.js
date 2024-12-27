import { db } from '@/app/db';
import { NextResponse } from 'next/server';
import queryString from 'query-string';
import crypto from "crypto";

export async function POST(req) {
  try {
    const body = await req.json()
    const blogId = crypto.randomBytes(3).toString("hex")
    if (body.id) return NextResponse.json(await db.blog.update({ where: { id: body.id }, data: body }))

    return NextResponse.json(await db.blog.create({
      data: {
        ...body,
        blogId: blogId,
        slug: `${body.slug}-${blogId}`
      }
    }))
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
          in: ["ho-tro", "chinh-sach-bao-mat", "hop-tac-ban-hang", "chinh-sach-doi-tra", "chinh-sach-bao-hanh",
            "huong-dan-mua-hang", "hinh-thuc-thanh-toan", "hinh-thuc-van-chuyen", "doi-tac", "khach-hang"]
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

    if (query.search) {
      condition.OR = [
        {
          slug: {
            search: `${query.search.trim().replaceAll(" ", " & ")}:*`
          }
        },
        {
          title: {
            search: `${query.search.trim().replaceAll(" ", " & ")}:*`
          }
        }
      ]
    }

    let orderBy = {}

    if (query.orderBy) {
      switch (orderBy) {
        case 'createdAt:asc':
          orderBy = { createdAt: 'asc' }
          break;
        case 'createdAt:desc':
        default:
          orderBy = { createdAt: 'desc' }
          break;
      }
    }

    const result = await db.blog.findMany({
      select: {
        id: true,
        blogId: true,
        title: true,
        slug: true,
        thumbnail: true,
        altThumb: true,
        metaTitle: true,
        metaDescription: true,
        keyword: true,
        active: true,
        activeFrom: true,
        description: true,
        author: true,
        summary: true,
        createdAt: true,
        updatedAt: true,
        type: true,
        blogCategory: true,
        blogSubCategory: true,
      },
      where: condition,
      take: size,
      skip: (page - 1) * size,
      orderBy: orderBy
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