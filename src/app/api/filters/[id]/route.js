import { db } from '@/app/db';
import { NextResponse } from 'next/server';

export async function DELETE(req, { params }) {
  try {
    await db.$transaction(async tx => {
      await tx.category_on_filter_value.deleteMany({ where: { filterValue: { filterId: params.id } } })
      await tx.brand_on_filter_value.deleteMany({ where: { filterValue: { filterId: params.id } } })
      await tx.filter_value.deleteMany({ where: { filterId: params.id } })
      await tx.filter.deleteMany({ where: { id: params.id } })
    })

    return NextResponse.json({ message: "Delete successfully" }, { status: 200 })
  } catch (e) {
    console.log(e)
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
    await db.$transaction(async tx => {
      await process(req, tx, params)
    })

    return NextResponse.json({ message: "Update successfully" }, { status: 200 })
  } catch (e) {
    console.log(e)
    return NextResponse.json({ message: "Something went wrong", error: e }, { status: 400 })
  }
}

const process = async (req, tx, params) => {
  let filter = await req.json()

  await tx.filter.updateMany({
    where: { id: params.id },
    data: {
      displayId: filter.displayId,
      name: filter.name,
      active: filter.active
    }
  })
}