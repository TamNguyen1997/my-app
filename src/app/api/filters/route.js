import { db } from '@/app/db';
import { cate_type } from '@prisma/client';
import { NextResponse } from 'next/server';
import queryString from 'query-string';

export async function POST(req) {
  try {
    let filter = await req.json()
    let filterValueJson = filter["filterValue"] || []
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
    console.log(e)
    return NextResponse.json({ message: "Something went wrong", error: e }, { status: 400 })
  }
}

export async function GET(req) {
  const { query } = queryString.parseUrl(req.url);
  let condition = {}

  if (query.categoryIds) {
    condition.filterValue = condition.filterValue || {}
    condition.filterValue = Object.assign(condition.filterValue, {
      some: {
        category_on_filter_value: {
          every: {
            category: {
              OR: [
                {
                  slug: {
                    in: query.categoryIds
                  },
                },
                {
                  id: {
                    in: query.categoryIds
                  }
                }
              ]
            }
          }
        }
      }
    })
  }

  if (query.brandId) {
    condition.filterValue = condition.filterValue || {}
    condition.filterValue = Object.assign(condition.filterValue, {
      some: {
        brand_on_filter_value: {
          every: {
            brand: {
              OR: [
                {
                  slug: query.brandId,
                },
                {
                  id: query.brandId
                }
              ]
            }
          }
        }
      }
    })
  }

  if (query.active) {
    condition.active = query.active === "true"
  }

  try {
    let result = await db.filter.findMany({
      orderBy: [
        {
          updatedAt: "desc"
        }
      ],
      where: condition,
      include: {
        filterValue: true
      }
    })

    result.forEach(async (filter, i) => {
      const categoryCount = await db.category_on_filter_value.count({
        where: {
          filterValue: {
            filterId: filter.id
          },
          category: {
            type: cate_type.CATE
          }
        }
      })

      const subCategoryCount = await db.category_on_filter_value.count({
        where: {
          filterValue: {
            filterId: filter.id
          },
          category: {
            type: cate_type.SUB_CATE
          }
        }
      })

      const brandCount = await db.brand_on_filter_value.count({
        where: {
          filterValue: {
            filterId: filter.id
          },
        }
      })


      result[i].categoryCount = categoryCount || 0
      result[i].brandCount = brandCount || 0
      result[i].subCategoryCount = subCategoryCount || 0
    })

    return NextResponse.json({
      result, total: await db.filter.count({ where: condition })
    })
  } catch (e) {
    console.log(e)
    return NextResponse.json({ message: "Something went wrong", error: e }, { status: 400 })
  }
}
