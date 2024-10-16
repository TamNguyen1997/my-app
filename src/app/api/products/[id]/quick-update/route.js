import { db } from '@/app/db';
import { NextResponse } from 'next/server';

export async function PUT(req, { params }) {
  if (!params.id) {
    return NextResponse.json({ message: `Resource not found ${params.id}` }, { status: 400 })
  }

  let body = await req.json()

  if (!body) return NextResponse.json({ message: "Invalid request body" }, { status: 400 })
  try {
    await db.product.update({ where: { id: params.id }, data: body })
    return NextResponse.json({ message: "Success" })
  } catch (e) {
    return NextResponse.json({ message: "Something went wrong", error: e }, { status: 400 })
  }
}

