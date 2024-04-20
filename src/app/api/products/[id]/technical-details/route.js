import { db } from '@/app/db';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  if (!params.id) {
    return NextResponse.json({ message: `Resource not found ${params.id}` }, { status: 400 })
  }
  try {
    const result = await db.technical_detail.findMany({ where: { productId: params.id } })
    if (!result) return NextResponse.json([])

    return NextResponse.json(result)
  } catch (e) {
    return NextResponse.json([])
  }
}