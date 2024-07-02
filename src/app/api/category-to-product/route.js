import { NextResponse } from 'next/server';
import { db } from '@/app/db';

export async function POST(req) {
  const body = await req.json()

  await db.categories_to_products.deleteMany({
    where: body
  })

  return NextResponse.json(await db.categories_to_products.create(
    {
      data: body
    }
  ))
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  let condition = {}

  if (searchParams.get("productId") && searchParams.get("productId") !== "undefined") {
    condition.productId = searchParams.get("productId")
  }

  if (searchParams.get("categoryId") && searchParams.get("categoryId") !== "undefined") {
    condition.categoryId = searchParams.get("categoryId")
  }

  return NextResponse.json(await db.categories_to_products.findMany(
    {
      where: condition
    }
  ))
}