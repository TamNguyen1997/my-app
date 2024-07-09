import { db } from '@/app/db';
import { NextResponse } from 'next/server';
import queryString from 'query-string';

export async function POST(req) {
  try {
    const body = await req.json()
    delete body.image
    delete body.technicalDetails
    delete body.technical_detail
    delete body.saleDetails
    delete body.category
    delete body.subCategory
    const product = await db.product.create(
      {
        data: body
      }
    )

    return NextResponse.json(product)
  } catch (e) {
    return NextResponse.json({ message: "Something went wrong", error: e }, { status: 400 })
  }
}

export async function GET(req) {
  let page = 1
  let size = 10
  const { query } = queryString.parseUrl(req.url);

  let condition = {}
  if (query) {
    page = parseInt(query.page) || 1
    size = parseInt(query.size) || 10

    if (query.highlight) {
      condition.highlight = query.highlight === 'true'
    }
    if (query.categoryId) {
      condition.categoryId = {
        in: query.categoryId.split(',')
      }
    }
    if (query.active) {
      condition.active = query.active === 'true'
    }
    if (query.name) {
      condition.name = {
        search: `${query.name.trim().replaceAll(" ", " & ")}:*`
      }
    }
    if (query.sku) {
      condition.sku = {
        search: `${query.sku.trim().replaceAll(" ", " & ")}:*`
      }
    }
    if (query.slug) {
      condition.slug = {
        search: `${query.slug.trim().replaceAll(" ", " & ")}:*`
      }
    }
  }

  try {
    const result = await db.product.findMany({
      where: condition,
      include: {
        saleDetails: true,
        image: true,
        category: true
      },
      orderBy: [
        {
          updatedAt: "desc"
        }
      ],
      take: size,
      skip: (page - 1) * size
    })

    return NextResponse.json({ result, total: await db.product.count({ where: condition }) })
  } catch (e) {
    console.log(e)
    return NextResponse.json({ message: "Something went wrong", error: e }, { status: 400 })
  }
}
