import { db } from '@/app/db';
import { NextResponse } from 'next/server';

export async function DELETE(req, { params }) {
  try {
    const filterValue = await db.filter_value.findFirst({ where: { id: params.id } })

    if (!filterValue) {
      return NextResponse.json({ message: "Filter value not found" }, { status: 404 })
    }

    await db.$transaction(async tx => {
      await tx.category_on_filter_value.deleteMany({ where: { filterValueId: filterValue.id } })
      await tx.brand_on_filter_value.deleteMany({ where: { filterValueId: filterValue.id } })
    })

    await db.$transaction(async tx => {
      await tx.sale_detail.updateMany({ where: { filterValueId: filterValue.id }, data: { filterValueId: null } })
      await tx.technical_detail.updateMany({ where: { filterValueId: filterValue.id }, data: { filterValueId: null } })
    })

    return NextResponse.json(await db.filter_value.delete({ where: { id: params.id } }))
  } catch (e) {
    return NextResponse.json({ message: "Something went wrong", error: e }, { status: 200 })
  }
}

export async function PUT(req, { params }) {
  try {
    return NextResponse.json(await db.filter_value.update({ where: { id: params.id }, data: await req.json() }))
  } catch (e) {
    return NextResponse.json({ message: "Something went wrong", error: e }, { status: 400 })
  }
}

export async function GET(req, { params }) {
  try {
    return NextResponse.json(
      await db.filter_value.findFirst({
        where: { id: params.id },
        include: {
          brands: true,
          categories: true,
          subCategories: true
        }
      })
    )
  } catch (e) {
    return NextResponse.json({ message: "Something went wrong", error: e }, { status: 400 })
  }
}