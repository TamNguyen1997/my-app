import { db } from '@/app/db';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  try {
    console.log(params)
    return NextResponse.json(await db.blog.findFirst({ where: { slug: params.id } }))
  } catch (e) {
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