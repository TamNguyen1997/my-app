import { db } from '@/app/db';
import { NextResponse } from 'next/server';
import queryString from 'query-string';

export async function GET(req, { params }) {
  if (!params.slug) {
    return NextResponse.json({ message: `Resource not found ${params.slug}` }, { status: 400 })
  }
  try {
    const { page = 1, size = 20 } = queryString.parseUrl(req.url).query;
    const category = await db.category.findFirst({
      where: { slug: params.slug },
      include: { image: true }
    })
    if (!category) {
      return NextResponse.json({ message: "No category found" }, { status: 404 })
    }
    const { query } = queryString.parseUrl(req.url);
    let filterId = []
    let condition = {
      OR: [
        {
          categoryId: category.id
        },
        {
          subCateId: category.id
        }
      ],
      AND: [
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

    let orderBy = {
      createdAt: 'desc'
    }

    if (query.brand) {
      const brandIds = (await db.brand.findMany({ where: { slug: { in: query.brand.split(',') } } })).map(brand => brand.id)

      condition.brandId = {
        in: brandIds
      }
    }
    if (query.active) {
      condition.active = query.active === 'true'
    }

    if (query.filterId) {
      filterId = (await db.filter.findMany({
        where: {
          slug: {
            in: Array.isArray(query.filterId) ? query.filterId : [query.filterId]
          }
        }
      })).map(item => item.id)

      condition.filterOnProduct = {
        some: {
          filterId: {
            in: filterId
          }
        }
      }
    }

    const minMax = query.range?.split('-')
    if (query.range && minMax.length == 2) {
      if (minMax.length != 2) {
        condition.saleDetails = {
          some: {
            showPrice: true,
            price: {
              gte: A,
              lte: B
            }
          }
        }
      }
    }

    let products = await db.product.findMany({
      where: condition,
      include: {
        image: true,
        subCate: true,
        filterOnProduct: true,
        category: true,
        brand: true,
        saleDetails: true
      },
      orderBy: orderBy
    })
    products = products.sort((a, b) => {
      const minPriceA = Math.min(...a.saleDetails.map(detail => detail.price));
      const minPriceB = Math.min(...b.saleDetails.map(detail => detail.price));
      return minPriceA - minPriceB; // Ascending order
    });
    const total = products.length

    return NextResponse.json({
      category: category,
      products: products.splice((page - 1) * size, size),
      total: total
    })
  } catch (e) {
    console.log(e)
    return NextResponse.json({ message: "Something went wrong", error: e }, { status: 400 })
  }
}