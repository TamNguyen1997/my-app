import { db } from '@/app/db';
import { NextResponse } from 'next/server';

export async function DELETE(req, { params }) {
  if (!params.slug) {
    return NextResponse.json({ message: `Resource not found ${params.slug}` }, { status: 400 })
  }

  try {
    return NextResponse.json(await db.category.delete({ where: { slug: params.slug } }))
  } catch (e) {
    return NextResponse.json({ message: "Something went wrong", error: e }, { status: 400 })
  }
}

export async function PUT(req, { params }) {
  if (!params.slug) {
    return NextResponse.json({ message: `Resource not found ${params.slug}` }, { status: 400 })
  }
  const body = await req.json()
  try {

    return NextResponse.json(await db.category.update({
      where: { id: params.slug },
      data: body
    }))
  } catch (e) {
    console.log(e)
  }
}
