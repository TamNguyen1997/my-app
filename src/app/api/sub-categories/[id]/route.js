import { db } from '@/app/db';
import { NextResponse } from 'next/server';

export async function PUT(req, { params }) {
  if (!params.id) {
    return NextResponse.json({ message: `Resource not found ${params.id}` }, { status: 400 })
  }
  const body = await req.json()
  return NextResponse.json(await db.subCategory.update({
    where: { id: params.id },
    data: body
  }))
}

export async function DELETE(req, { params }) {
  if (!params.id) {
    return NextResponse.json({ message: `Resource not found ${params.id}` }, { status: 400 })
  }
  return NextResponse.json(await db.subCategory.delete({
    where: { id: params.id }
  }))
}