import { db } from '@/app/db';
import { cate_type } from '@prisma/client';
import { NextResponse } from 'next/server';
import queryString from 'query-string';

export async function POST(req) {
  try {
    let filter = await req.json()
    let filterValueJson = filter["filterValue"] || []
    delete filter["filterValue"];
    if (await db.filter.findFirst({ where: { id: filter.id } })) {
      return NextResponse.json({ message: "ID của filter đã tổn tại" }, { status: 400 })
    }
    const createdFilter = await db.filter.create({ data: filter })

    await db.$transaction(async tx => {
      for (let filterValue of filterValueJson) {
        const filterValueId = filterValue.id

        let brandOnFilterValues = filterValue["brands"].map(item => ({
          filterValueId: filterValueId,
          brandId: item
        }))

        let categoryOnFilterValues = [
          ...Array.from(new Set(filterValue["categories"])),
          ...Array.from(new Set(filterValue["subCategories"]))]
          .map(item => ({
            categoryId: item,
            filterValueId: filterValueId
          }))

        delete filterValue["brands"]
        delete filterValue["categories"]
        delete filterValue["subCategories"]
        await tx.filter_value.create({ data: filterValue })

        await tx.brand_on_filter_value.createMany({
          data: brandOnFilterValues
        })
        await tx.category_on_filter_value.createMany({
          data: categoryOnFilterValues
        })
      }
    })

    return NextResponse.json(createdFilter, { status: 200 })
  } catch (e) {
    console.log(e)
    return NextResponse.json({ message: "Something went wrong", error: e }, { status: 400 })
  }
}

export async function GET(req) {
  const { query } = queryString.parseUrl(req.url);
  let condition = {}

  let size = 1000000
  let page = 1

  if (query.size && query.page) {
    page = parseInt(query.page) || 1
    size = parseInt(query.size) || 10
  }

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
      },
      skip: (page - 1) * size,
      take: size
    })

    for (let i = 0; i < result.length; i++) {
      const categoryCount = await db.category_on_filter_value.findMany({
        where: {
          filterValue: {
            filterId: result[i].id
          },
          category: {
            type: cate_type.CATE
          },
        },
        distinct: ["categoryId"]
      })

      const subCategoryCount = await db.category_on_filter_value.findMany({
        where: {
          filterValue: {
            filterId: result[i].id
          },
          category: {
            type: cate_type.SUB_CATE
          }
        },
        distinct: ["categoryId"]
      })

      const brandCount = await db.brand_on_filter_value.findMany({
        where: {
          filterValue: {
            filterId: result[i].id
          },
        },
        distinct: ["brandId"]
      })


      result[i].categoryCount = categoryCount.length || 0
      result[i].brandCount = brandCount.length || 0
      result[i].subCategoryCount = subCategoryCount.length || 0
    }

    return NextResponse.json({
      result, total: await db.filter.count({ where: condition })
    })
  } catch (e) {
    console.log(e)
    return NextResponse.json({ message: "Something went wrong", error: e }, { status: 400 })
  }
}
