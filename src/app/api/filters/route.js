import { db } from '@/app/db';
import { NextResponse } from 'next/server';
import queryString from 'query-string';

export async function POST(req) {
  try {
    const body = await req.json()
    return NextResponse.json(
      await db.filter.create(
        {
          data: body
        }
      )
    )
  } catch (e) {
    return NextResponse.json({ message: "Something went wrong", error: e }, { status: 400 })
  }
}

export async function GET(req) {
  const { query } = queryString.parseUrl(req.url);
  let condition = {}

  if (query) {
    if (query.categoryId) {
      const category = await db.category.findFirst({ where: { slug: query.categoryId } })
      if (category) {
        condition.categoryId = category.id
      }
    }

    if (query.brandId) {
      const brand = await db.brand.findFirst({ where: { slug: query.brandId } })
      if (brand) {
        condition.brandId = brand.id
      }
    }
  }

  try {
    let result = await db.filter.findMany({
      orderBy: [
        {
          updatedAt: "desc"
        }
      ],
      where: condition
    })

    result.forEach(async (filter, i) => {
      const filterValues = (await db.filter_value.findMany({
        where: { filterId: filter.id }, include: {
          _count: {
            as: "categoryCount",
            select: { categories: true }
          },
          _count: {
            as: "subCategoryCount",
            select: { subCategories: true }
          },
          _count: {
            as: "brandCount",
            select: { brands: true }
          }
        }
      }))

      result[i].categoryCount = filterValues.reduce((acc, val) => acc + val.categoryCount, 0)
      result[i].brandCount = filterValues.reduce((acc, val) => acc + val.brandCount, 0)
      result[i].subCategoryCount = filterValues.reduce((acc, val) => acc + val.subCategoryCount, 0)
    })

    return NextResponse.json({
      result, total: await db.filter.count({ where: condition })
    })
  } catch (e) {
    console.log(e)
    return NextResponse.json({ message: "Something went wrong", error: e }, { status: 400 })
  }
}
