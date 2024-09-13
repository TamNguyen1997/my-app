import { db } from '@/app/db';
import { NextResponse } from 'next/server';

export async function DELETE(req, { params }) {
  try {
    return NextResponse.json(await db.filter.delete({ where: { id: params.id } }))
  } catch (e) {
    return NextResponse.json({ message: "Something went wrong", error: e }, { status: 400 })
  }
}

export async function GET(req, { params }) {
  try {
    return NextResponse.json(await db.filter.findFirst({ where: { id: params.id } }))
  } catch (e) {
    return NextResponse.json({ message: "Something went wrong", error: e }, { status: 400 })
  }
}

export async function PUT(req, { params }) {
  try {
    let filter = await req.json()
    let filterValueJson = filter["filterValue"].filter(item => item.createdAt)
    let newFilterValueJson = filter["filterValue"].filter(item => !item.createdAt)

    await db.filter_value.deleteMany({ where: { id: { not: { in: filter["filterValue"].map(item => item.id) } } } })
    delete filter["filterValue"];
    await db.filter.update({ where: { id: filter.id }, data: filter })
    for (let filterValue of filterValueJson) {
      const filterValueId = filterValue.id
      let brands = filterValue["brands"]
      let categories = filterValue["categories"]
      let subCategories = filterValue["subCategories"]
      delete filterValue["brands"]
      delete filterValue["categories"]
      delete filterValue["subCategories"]
      await db.filter_value.update({ where: { id: filterValueId }, data: filterValue })
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

    for (let filterValue of newFilterValueJson) {
      const filterValueId = filterValue.id
      let brands = filterValue["brands"]
      let categories = filterValue["categories"]
      let subCategories = filterValue["subCategories"]
      delete filterValue["brands"]
      delete filterValue["categories"]
      delete filterValue["subCategories"]
      await db.filter_value.createMany({ data: filterValue })

      if (brands.length) {
        await db.brand.updateMany({
          where: {
            id: {
              in: brands.map(brand => brand)
            }
          }, data: { filter_valueId: filterValueId }
        })
      }

      if (categories.length) {
        await db.category.updateMany({
          where: {
            id: {
              in: categories.map(cate => cate)
            }
          }, data: { filterValueOnCategoryId: filterValueId }
        })
      }

      if (subCategories.length) {
        await db.category.updateMany({
          where: {
            id: {
              in: subCategories.map(subcate => subcate)
            }
          }, data: { filterValueOnSubCategoryId: filterValueId }
        })
      }
    }

    return NextResponse.json({ message: "Update successfully" }, { status: 200 })
  } catch (e) {
    console.log(e)
    return NextResponse.json({ message: "Something went wrong", error: e }, { status: 400 })
  }
}