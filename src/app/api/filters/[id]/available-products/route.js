import { db } from '@/app/db';
import { NextResponse } from 'next/server';
import queryString from 'query-string';

export async function GET(req, { params }) {
  let page = 1
  let size = 10
  try {
    const { query } = queryString.parseUrl(req.url);
    if (query) {
      page = parseInt(query.page) || 1
      size = parseInt(query.size) || 10
    }
    const result = await db.product.findMany({
      include: {
        image: true,
        category: true,
        subCate: true,
        brand: true
      },
      where: {
        OR: [
          {
            filterOnProduct: { none: {} }
          },
          {
            NOT: {
              filterOnProduct: {
                some: {
                  filterId: params.id
                }
              }
            }
          }
        ]
      },
      take: size,
      skip: (page - 1) * size
    })

    return NextResponse.json({
      result,
      total: await db.product.count({
        where: {
          OR: [
            {
              filterOnProduct: { none: {} }
            },
            {
              NOT: {
                filterOnProduct: {
                  some: {
                    filterId: params.id
                  }
                }
              }
            }
          ]
        }
      })
    })
  } catch (e) {
    return NextResponse.json({ message: "Something went wrong", error: e }, { status: 400 })
  }
}
