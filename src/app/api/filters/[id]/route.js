import { db } from '@/app/db';
import { NextResponse } from 'next/server';
import { json } from 'stream/consumers';

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

export async function PUT(req) {

  try {
    await db.$transaction(async tx => {
      await process(req, tx)
    })

    return NextResponse.json({ message: "Update successfully" }, { status: 200 })
  } catch (e) {
    console.log(e)
    return NextResponse.json({ message: "Something went wrong", error: e }, { status: 400 })
  }
}

const process = async (req, tx) => {
  let filter = await req.json()
  let filterValueJson = new Set(filter["filterValue"].filter(item => item.createdAt))
  let newFilterValueJson = filter["filterValue"].filter(item => !item.createdAt)

  await tx.filter.update({
    where: { id: filter.id }, data: {
      name: filter.name,
      active: filter.active
    }
  })
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
    await tx.filter_value.update({
      where: { id: filterValueId },
      data: {
        value: filterValue.value,
        slug: filterValue.slug,
        active: filterValue.active,
      }
    })
    await tx.brand_on_filter_value.deleteMany({
      where: {
        filterValueId: filterValueId
      }
    })

    await tx.category_on_filter_value.deleteMany({
      where: {
        filterValueId: filterValueId
      }
    })

    await tx.brand_on_filter_value.createMany({
      data: brandOnFilterValues
    })
    await tx.category_on_filter_value.createMany({
      data: categoryOnFilterValues
    })
  }

  for (let filterValue of newFilterValueJson) {
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
    await tx.filter_value.create({
      data: {
        value: filterValue.value,
        slug: filterValue.slug,
        active: filterValue.active,
        filterId: filterValue.filterId
      }
    })

    await tx.brand_on_filter_value.createMany({
      data: brandOnFilterValues
    })
    await tx.category_on_filter_value.createMany({
      data: categoryOnFilterValues
    })
  }
}