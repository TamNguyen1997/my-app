import { db } from '@/app/db';
import { NextResponse } from 'next/server';
import queryString from 'query-string';

export async function GET(req, { params }) {
  if (!params.slug) {
    return NextResponse.json({ message: `Resource not found ${params.slug}` }, { status: 400 })
  }
  try {
    const { page = 1, size = 20 } = queryString.parseUrl(req.url).query;
    const brand = await db.brand.findFirst({ where: { slug: params.slug } })

    if (!brand) {
      return NextResponse.json({ message: "No brand found" }, { status: 404 })
    }

    let condition = {
      brandId: brand.id,
      AND: [
        {
          NOT: {
            categoryId: null
          }
        },
        {
          NOT: {
            subCateId: null
          }
        }
      ]
    }
    let orderBy = {
      createdAt: 'desc'
    }

    const { query } = queryString.parseUrl(req.url);
    let filterId = []

    if (query.category) {
      condition.categoryId = {
        in: query.category.split(',')
      }
    }

    if (query.subCategory) {
      condition.subCateId = {
        in: query.subCategory.split(',')
      }
    }

    if (query.active) {
      condition.active = query.active === 'true'
    }

    if (query.filterId) {
      filterId = Array.isArray(query.filterId) ? query.filterId : [query.filterId]

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
        imageUrl: true,
      },
      orderBy: orderBy
    })

    products = products.sort((a, b) => {
      const minPriceA = Math.min(...a.saleDetails.map(detail => detail.price));
      const minPriceB = Math.min(...b.saleDetails.map(detail => detail.price));
      return minPriceA - minPriceB; // Ascending order
    });
    const total = products.length

    return NextResponse.json({ brand, products: products.splice(page - 1, size), total })
  } catch (e) {
    console.log(e)
    return NextResponse.json({ message: "Something went wrong", error: e }, { status: 400 })
  }
}