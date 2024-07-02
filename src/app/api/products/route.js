import { db } from '@/app/db';
import { NextResponse } from 'next/server';
import queryString from 'query-string';

export async function POST(req) {
  try {
    const body = await req.json()
    const categoryId = body.categoryId
    delete body.categoryId
    delete body.image
    delete body.technicalDetails
    delete body.saleDetails
    const product = await db.product.create(
      {
        data: body
      }
    )

    await db.categories_to_products.create({
      data: {
        categoryId: categoryId,
        productId: product.id
      }
    })

    return NextResponse.json(product)
  } catch (e) {
    return NextResponse.json({ message: "Something went wrong", error: e }, { status: 400 })
  }
}

export async function GET(req) {
  let page = 1
  let size = 10
  const { query } = queryString.parseUrl(req.url);

  if (query) {
    page = parseInt(query.page) || 1
    size = parseInt(query.size) || 10
  }

  try {
    const result = await db.product.findMany({
      include: {
        saleDetails: true
      },
      orderBy: [
        {
          updatedAt: "desc"
        }
      ],
      take: size,
      skip: (page - 1) * size
    })

    return NextResponse.json({ result, total: await db.product.count() })
  } catch (e) {
    return NextResponse.json({ message: "Something went wrong", error: e }, { status: 400 })
  }
}
