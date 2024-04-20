import { db } from '@/app/db';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  if (!params.id) {
    return NextResponse.json({ message: `Resource not found ${params.id}`}, { status: 400 })
  }
  try {
    return NextResponse.json(await db.primary_sale_detail.findMany({ where: { productId: params.id } }))
  } catch (e) {
    return NextResponse.json([])
  }
}