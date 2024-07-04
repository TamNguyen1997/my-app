import { db } from '@/app/db';
import { NextResponse } from 'next/server';
import queryString from 'query-string';

export async function GET(req, { params }) {
  if (!params.slug) {
    return NextResponse.json({ message: `Resource not found ${params.slug}` }, { status: 400 })
  }
  try {
    const category = await db.category.findFirst({ where: { slug: params.slug } })

    if (!category) {
      return NextResponse.json({ message: "No category found" }, { status: 404 })
    }

    const categoriesToProducts = await db.categories_to_products.findMany({
      where: { categoryId: category.id }, include: {
        product: {
          include: {
            image: true,
            saleDetails: {
              orderBy: {
                price: 'desc'
              }
            }
          }
        }
      }
    })

    let products = categoriesToProducts.map(item => item.product)

    const { query } = queryString.parseUrl(req.url);
    if (query.brand) {
      const brand = await db.category.findMany({ where: { slug: { in: query.brand.split(',') } } })
      if (!brand) return

      const brandIds = brand.map(item => item.id)

      const brandsToProducts = (await db.categories_to_products.findMany({
        where: {
          categoryId: {
            in: brandIds
          }
        },
        include: { product: true }
      })).map(item => item.product.id)

      products = products.filter(item => brandsToProducts.includes(item.id))
    }

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
    return NextResponse.json({
      category: category,
      products: products
    })
  } catch (e) {
    console.log(e)
    return NextResponse.json({ message: "Something went wrong", error: e }, { status: 400 })
  }
}