import { db } from '@/app/db';
import { NextResponse } from 'next/server';
import queryString from 'query-string';

export async function GET(req) {
  let page = 1
  let size = 10
  const { query } = queryString.parseUrl(req.url);

  let condition = {
    active: true
  }
  if (query) {
    page = parseInt(query.page) || 1
    size = parseInt(query.size) || 10

    if (query.searchTerm) {
      condition = {
        AND: [
          {
            active: true
          },
          {
            OR: [
              {
                name: {
                  contains: query.searchTerm
                }
              },
              {
                id: {
                  contains: query.searchTerm
                }
              },
              {
                saleDetails: {
                  some: {
                    sku: {
                      contains: query.searchTerm
                    }
                  }
                }
              },
              {
                slug: {
                  contains: query.searchTerm
                }
              }
            ]
          }
        ]
      }
    }
  }

  try {
    const result = await db.product.findMany({
      select: {
        active: true,
        brandId: true,
        categoryId: true,
        createdAt: true,
        id: true,
        name: true,
        imageId: true,
        productId: true,
        slug: true,
        updatedAt: true,
        imageAlt: true,
        imageId: true,
        saleDetails: true,
        technical_detail: true,
        image: true,
        category: true,
        subCate: true,
        brand: true,
      },
      where: condition,
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
