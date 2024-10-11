import { db } from '@/app/db';
import { cate_type } from '@prisma/client';
import { NextResponse } from 'next/server';
import queryString from 'query-string';

export async function GET(req, { params }) {
  let page = 1
  let size = 10
  try {
    const { query } = queryString.parseUrl(req.url);
    if (query) {
      page = parseInt(query.page) || 1
      size = parseInt(query.size) || 10
    }

    const data = await db.filter.findFirst({
      where: { id: params.id },
      include: {
        filterValue: {
          include: {
            brand_on_filter_value: {
              include: {
                brand: true
              }
            },
            category_on_filter_value: {
              include: {
                category: true
              }
            }
          },
          take: size,
          skip: (page - 1) * size
        }
      },
    })

    const filterValues = data.filterValue.map(filterValue => {
      return {
        ...filterValue,
        brands: filterValue.brand_on_filter_value.map(brand_on_filter_value => brand_on_filter_value.brand),
        categories: filterValue.category_on_filter_value
          .filter(category_on_filter_value => category_on_filter_value.category && category_on_filter_value.category.type === cate_type.CATE)
          .map(category_on_filter_value => category_on_filter_value.category),
        subCategories: filterValue.category_on_filter_value
          .filter(category_on_filter_value => category_on_filter_value.category && category_on_filter_value.category.type === cate_type.SUB_CATE)
          .map(category_on_filter_value => category_on_filter_value.category)
      }
    })

    return NextResponse.json({ ...data, filterValue: filterValues })
  } catch (e) {
    return NextResponse.json({ message: "Something went wrong", error: e }, { status: 400 })
  }
}

export async function POST(req, { params }) {
  try {
    const data = await req.json()

    const result = await db.$transaction(async tx => {
      const filterValue = await tx.filter_value.create({
        data: {
          id: data.id,
          value: data.value,
          slug: data.slug,
          filterId: params.id,
          active: data.active
        }
      })

      if (data.categories?.length) {
        await tx.category_on_filter_value.create({
          data: {
            filterValueId: filterValue.id,
            categoryId: data.categories[0]
          }
        })
      }
      if (data.subCategories?.length) {
        await tx.category_on_filter_value.create({
          data: {
            filterValueId: filterValue.id,
            categoryId: data.subCategories[0]
          }
        })
      }
      if (data.brands?.length) {
        await tx.brand_on_filter_value.create({
          data: {
            filterValueId: filterValue.id,
            brandId: data.brands[0]
          }
        })
      }
      return filterValue
    })

    return NextResponse.json(result)
  } catch (e) {
    console.log(e)
    return NextResponse.json({ message: "Something went wrong", error: e }, { status: 400 })
  }
}