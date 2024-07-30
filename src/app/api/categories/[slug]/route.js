import { db } from '@/app/db';
import { NextResponse } from 'next/server';

export async function DELETE(req, { params }) {
  if (!params.slug) {
    return NextResponse.json({ message: `Resource not found ${params.slug}` }, { status: 400 })
  }

  try {
    return NextResponse.json(await db.category.delete({ where: { id: params.slug } }))
  } catch (e) {
    return NextResponse.json({ message: "Something went wrong", error: e }, { status: 400 })
  }
}

export async function PUT(req, { params }) {
  if (!params.slug) {
    return NextResponse.json({ message: `Resource not found ${params.slug}` }, { status: 400 })
  }
  let body = await req.json()
  delete body.image
  delete body.subcates
  try {

    return NextResponse.json(await db.category.update({
      where: { id: params.slug },
      data: body
    }))
  } catch (e) {
    return NextResponse.json({ message: "Something went wrong", error: e }, { status: 400 })
  }
}
