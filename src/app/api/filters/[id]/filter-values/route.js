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