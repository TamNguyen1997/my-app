import { db } from '@/app/db';
import { NextResponse } from 'next/server';
import queryString from 'query-string';

export async function GET(req, { params }) {
  if (!params.slug) {
    return NextResponse.json({ message: `Resource not found ${params.slug}` }, { status: 400 })
  }
  try {
    const category = await db.category.findFirst({
      where: { slug: params.slug },
      include: { image: true }
    })

    console.log(category)

    if (!category) {
      return NextResponse.json({ message: "No category found" }, { status: 404 })
    }


    const { query } = queryString.parseUrl(req.url);
    let condition = {
      OR: [
        {
          categoryId: category.id
        },
        {
          subCateId: category.id
        }
      ]
    }

    console.log(condition)
    if (query.brand) {
      const brandIds = (await db.brand.findMany({ where: { slug: { in: query.brand.split(',') } } })).map(brand => brand.id)

      condition.brandId = {
        in: brandIds
      }
    }

    if (query.active) {
      condition.active = query.active === 'true'
    }

    let products = await db.product.findMany({ where: condition, include: { image: true } })

    if (query.range) {
      const minMax = query.range.split('-')
      if (minMax.length != 2) return

      products = products.filter(item => {
        const hasSaleDetails = item.saleDetails?.length > 0
        if (!hasSaleDetails) return false
        const max = item.saleDetails[0]?.price <= parseInt(minMax[1])
        const min = item.saleDetails.filter(detail => detail.price >= parseInt(minMax[0])).length >= 0

        return hasSaleDetails && max && min
      })
    }
    return NextResponse.json({
      category: category,
      products: products
    })
  } catch (e) {
    return NextResponse.json({ message: "Something went wrong", error: e }, { status: 400 })
  }
}