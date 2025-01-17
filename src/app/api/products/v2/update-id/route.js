import { db } from '@/app/db';
import { NextResponse } from 'next/server';

export async function PUT(req) {
  try {
    let body = await req.json()
    if (!body.oldId || !body.newId) return NextResponse.json({ message: "ID không hợp lệ" }, { status: 400 })

    if (body.oldId !== body.newId) {
      await db.product.update({ where: { id: body.oldId }, data: { id: body.newId } })
    }

    return NextResponse.json({ message: "Success" })
  } catch (e) {
    console.log(e)
    return NextResponse.json({ message: "Something went wrong", error: e }, { status: 400 })
  }
}
