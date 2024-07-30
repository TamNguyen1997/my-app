import { db } from '@/app/db';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  try {
    let result = await db.blog.findFirst({ where: { slug: params.id } })
    if (!result) {
      result = await db.blog.create({ data: { slug: params.id, content: "<p></p>", title: params.id } })
    }
    return NextResponse.json(result)
  } catch (e) {
    console.log(e)
    return NextResponse.json({ message: "Something went wrong", error: e }, { status: 400 })
  }
}

export async function DELETE(req, { params }) {
  try {
    return NextResponse.json(await db.blog.delete({ where: { id: params.id } }))
  } catch (e) {
    return NextResponse.json({ message: "Something went wrong", error: e }, { status: 400 })
  }
}