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
    let filterValueJson = filter["filterValue"]
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
      for (let brand of brands) {
        await db.brand.update({ where: { id: brand }, data: { filter_valueId: filterValueId } })
      }
      for (let category of categories) {
        await db.category.update({ where: { id: category }, data: { filterValueOnCategoryId: filterValueId } })
      }
      for (let subCategory of subCategories) {
        await db.category.update({ where: { id: subCategory }, data: { filterValueOnSubCategoryId: filterValueId } })
      }
    }

    return NextResponse.json({ message: "Update successfully" }, { status: 200 })
  } catch (e) {
    return NextResponse.json({ message: "Something went wrong", error: e }, { status: 400 })
  }
}