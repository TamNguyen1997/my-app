import { db } from '@/app/db';
import { NextResponse } from 'next/server';
import queryString from 'query-string';

export async function POST(req) {
  try {
    let filter = await req.json()
    let filterValueJson = filter["filterValue"]
    delete filter["filterValue"];
    const createdFilter = await db.filter.create({ data: filter })
    for (let filterValue of filterValueJson) {
      const filterValueId = filterValue.id
      let brands = filterValue["brands"]
      let categories = filterValue["categories"]
      let subCategories = filterValue["subCategories"]
      delete filterValue["brands"]
      delete filterValue["categories"]
      delete filterValue["subCategories"]
      await db.filter_value.create({ data: filterValue })

      await db.brand.updateMany({
        where: {
          id: {
            in: brands.map(brand => brand)
          }
        }, data: { filter_valueId: filterValueId }
      })
      await db.category.updateMany({
        where: {
          id: {
            in: categories.map(cate => cate)
          }
        }, data: { filterValueOnCategoryId: filterValueId }
      })

      await db.category.updateMany({
        where: {
          id: {
            in: subCategories.map(subcate => subcate)
          }
        }, data: { filterValueOnSubCategoryId: filterValueId }
      })
    }

    return NextResponse.json(createdFilter, { status: 200 })
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
