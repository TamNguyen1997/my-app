import { db } from '@/app/db';
import { NextResponse } from 'next/server';
import queryString from 'query-string';
import crypto from "crypto";
import slugify from 'slugify';

export async function POST(req) {
  try {
    let body = await req.json()
    delete body.image
    delete body.technicalDetails
    delete body.technical_detail
    delete body.saleDetails
    delete body.category
    delete body.subCategory

    if (!body.id) {
      body.id = crypto.randomBytes(3).toString("hex")
    }
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
    if (query.subCateId) {
      condition.subCateId = {
        in: query.subCateId.split(',')
      }
    }
    if (query.active) {
      condition.active = query.active === 'true'
    }
    if (query.id_name) {
      const idNameQuery = slugify(query.id_name, { locale: 'vi' }).replaceAll("(", "").replaceAll(")", "")
      condition = Object.assign(condition, {
        OR: [
          {
            name: {
              search: `${idNameQuery.trim().replaceAll(" ", " & ")}:*`
            }
          },
          {
            id: {
              search: `${idNameQuery.trim().replaceAll(" ", " & ")}:*`
            }
          },
          {
            slug: {
              search: `${idNameQuery.trim().replaceAll(" ", " & ")}:*`
            }
          }
        ]
      })
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

    if (query.brandId) {
      condition.brand = {
        slug: query.brandId
      }
    }
    let productIds = []

    if (query.productId) {
      productIds.push(query.productId)
    }
    if (query.filterId) {
      const saleDetails = await db.sale_detail.findMany({
        where: {
          OR: [
            {
              filterValueId: {
                in: typeof query.filterId === 'string' ? [query.filterId] : query.filterId
              }
            }, {
              filterValue: {
                slug: {
                  in: typeof query.filterId === 'string' ? [query.filterId] : query.filterId
                }
              }
            }
          ]
        }
      })
      const saleDetailProductIds = saleDetails.map(item => item.productId)

      const technicalDetails = await db.technical_detail.findMany({
        where: {
          OR: [
            {
              filterValueId: {
                in: typeof query.filterId === 'string' ? [query.filterId] : query.filterId
              }
            },
            {
              filterValue: {
                slug: {
                  in: typeof query.filterId === 'string' ? [query.filterId] : query.filterId
                }
              }
            }
          ]
        }
      })

      const technicalDetailsProductIds = technicalDetails.map(item => item.productId)

      const intersection = Array.from(new Set([...saleDetailProductIds, ...technicalDetailsProductIds]))


      if (!intersection.length) {
        return NextResponse.json({ result: [], total: 0 })
      }
      productIds.push(...intersection)
    }

    if (productIds.length) {
      condition.id = {
        in: productIds
      }
    }

    if (query.slug) {
      condition.slug = {
        search: `${query.slug.trim().replaceAll(" ", " & ")}:*`
      }
    }
    if (query.includeCate) {
      condition.AND =
        [
          {
            NOT: {
              categoryId: null
            },
            NOT: {
              subCateId: null
            }
          }
        ]
    }

    if (query.productType) {
      condition.productType = query.productType
    }
  }

  try {
    const result = await db.product.findMany({
      where: condition,
      include: {
        saleDetails: true,
        technical_detail: true,
        image: true,
        category: true,
        subCate: true,
        brand: true,
        product_on_image: {
          include: { image: true }
        }
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
