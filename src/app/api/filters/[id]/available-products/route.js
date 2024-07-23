import { db } from '@/app/db';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  try {
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
      }
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
