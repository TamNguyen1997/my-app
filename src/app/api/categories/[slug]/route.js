import { db } from '@/app/db';
import { cate_type } from '@prisma/client';
import { NextResponse } from 'next/server';

export async function DELETE(req, { params }) {
  if (!params.slug) {
    return NextResponse.json({ message: `Resource not found ${params.slug}` }, { status: 400 })
  }

  try {
    if (await db.category.findFirst({ where: { cateId: params.slug } })) {
      return NextResponse.json({ message: `Cần xóa sub cate của ${params.slug} trước` }, { status: 400 })
    }

    if (await db.category_on_filter_value.findFirst({ where: { category: { id: params.slug } } })) {
      return NextResponse.json({ message: `Cần xóa filter của ${params.slug} trước` }, { status: 400 })
    }

    await db.category.deleteMany({ where: { cateId: params.slug } })
    return NextResponse.json(await db.category.delete({ where: { id: params.slug } }))
  } catch (e) {
    return NextResponse.json({ message: "Something went wrong", error: e }, { status: 400 })
  }
}

export async function GET(req, { params }) {
  if (!params.slug) {
    return NextResponse.json({ message: `Resource not found ${params.slug}` }, { status: 400 })
  }

  try {
    return NextResponse.json(await db.category.findFirst({ where: { slug: params.slug } }))
  } catch (e) {
    return NextResponse.json({ message: "Something went wrong", error: e }, { status: 400 })
  }
}

export async function PUT(req, { params }) {
  if (!params.slug) {
    return NextResponse.json({ message: `Resource not found ${params.slug}` }, { status: 400 })
  }
  let body = await req.json()
  const highlightedCates = await db.category.findMany({
    where: {
      highlight: true,
      type: cate_type.CATE,
      NOT: {
        id: params.slug
      }
    }
  })

  if (highlightedCates.length === 3 && body.highlight) {
    return NextResponse.json({ message: "Tối đa 3 category nổi bật" }, { status: 400 })
  }
  delete body.image
  delete body.subcates
  try {
    if (body.id !== params.slug && await db.category.findFirst({ where: { cateId: params.slug } })) {
      return NextResponse.json({ message: "Không thể sửa ID do liên kết với sub cate" }, { status: 400 })
    }
    return NextResponse.json(await db.category.updateMany({
      where: { id: params.slug },
      data: body
    }))
  } catch (e) {
    console.log(e)
    return NextResponse.json({ message: "Something went wrong", error: e }, { status: 400 })
  }
}
