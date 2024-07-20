import { db } from '@/app/db';
import { NextResponse } from 'next/server';
import queryString from 'query-string';

export async function GET(req, { params }) {
  if (!params.slug) {
    return NextResponse.json({ message: `Resource not found ${params.slug}` }, { status: 400 })
  }
  try {
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

    const { query } = queryString.parseUrl(req.url);

    if (query.brand) {
      const brandIds = (await db.brand.findMany({ where: { slug: { in: query.brand.split(',') } } })).map(brand => brand.id)

      condition.brandId = {
        in: brandIds
      }
    }

    if (query.category) {
      const categoryIds = (await db.category.findMany({ where: { slug: { in: query.category.split(',') } } })).map(category => category.id)

      condition.categoryId = {
        in: categoryIds
      }
    }

    if (query.subCategory) {
      const subCateIds = (await db.category.findMany({ where: { slug: { in: query.subCategory.split(',') } } })).map(subcate => subcate.id)

      condition.subCateId = {
        in: subCateIds
      }
    }

    if (query.active) {
      condition.active = query.active === 'true'
    }

    let products = await db.product.findMany({
      where: condition,
      include: {
        image: true,
        subCate: true,
        saleDetails: true
      }
    })

    if (query.range) {
      const minMax = query.range.split('-')
      if (minMax.length != 2) return

      products = products.filter(item => {
        const hasSaleDetails = item.saleDetails.length > 0

        const max = item.saleDetails[0]?.price <= parseInt(minMax[1])
        const min = item.saleDetails.filter(detail => detail.price >= parseInt(minMax[0])).length >= 0

        return hasSaleDetails && max && min
      })
    }

    return NextResponse.json({ brand, products })
  } catch (e) {
    return NextResponse.json({ message: "Something went wrong", error: e }, { status: 400 })
  }
}