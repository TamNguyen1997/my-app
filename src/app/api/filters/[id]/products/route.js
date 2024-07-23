import { db } from '@/app/db';
import { NextResponse } from 'next/server';
import queryString from 'query-string';

export async function GET(req, { params }) {
  try {
    let page = 1
    let size = 10
    const { query } = queryString.parseUrl(req.url);

    if (query) {
      page = parseInt(query.page) || 1
      size = parseInt(query.size) || 10
    }
    const result = await db.product.findMany({
      where: {
        filterOnProduct: {
          some: {
            filterId: params.id
          }
        }
      },
      orderBy: [
        {
          updatedAt: "desc"
        }
      ],
      include: {
        image: true,
        category: true,
        subCate: true,
        brand: true
      },
      take: size,
      skip: (page - 1) * size
    })

    return NextResponse.json({
      result,
      total: await db.product.count({
        where: {
          filterOnProduct: {
            some: {
              filterId: params.id
            }
          }
        }
      })
    })
  } catch (e) {
    console.log(e)
    return NextResponse.json({ message: "Something went wrong", error: e }, { status: 400 })
  }
}

export async function POST(req, { params }) {
  try {
    let page = 1
    let size = 10
    const { query } = queryString.parseUrl(req.url);

    if (query) {
      page = parseInt(query.page) || 1
      size = parseInt(query.size) || 10
    }

    await db.filter_on_product.deleteMany({
      where: {
        filterId: params.id
      }
    })

    const body = await req.json() || { productId: [] }
    const data = body.productIds.map(id => {
      return {
        productId: id,
        filterId: params.id
      }
    })
    await db.filter_on_product.createMany({
      data: data
    })

    return NextResponse.json({ message: "Success" })
  } catch (e) {
    return NextResponse.json({ message: "Something went wrong", error: e }, { status: 400 })
  }
}