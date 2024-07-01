import { NextResponse } from 'next/server';
import { db } from '@/app/db';

export async function POST(req) {
  const body = await req.json()
  return NextResponse.json(await db.categories_to_products.create(
    {
      data: body
    }
  ))
}