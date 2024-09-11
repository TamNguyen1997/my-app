import { db } from '@/app/db';
import { NextResponse } from 'next/server';

export async function PUT(req, { params }) {
  try {
    const filter = await req.json()
    return NextResponse.json(await db.filter.update({ where: { id: params.id }, data: filter }), { status: 200 })
  } catch (e) {
    console.log(e)
    return NextResponse.json({ message: "Something went wrong", error: e }, { status: 400 })
  }
}