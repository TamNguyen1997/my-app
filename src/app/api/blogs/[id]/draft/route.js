import { db } from '@/app/db';
import { NextResponse } from 'next/server';

export async function PUT(req, { params }) {
  try {
    const result = await db.blog.update({ where: { id: params.id }, data: { draft: (await req.json()).draft } })

    return NextResponse.json(result)
  } catch (e) {
    console.log(e)
    return NextResponse.json({ message: "Something went wrong", error: e }, { status: 400 })
  }
}