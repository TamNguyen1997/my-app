import { NextResponse } from 'next/server';
import { db } from '@/app/db';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  let condition = {}

  if (searchParams.get("type") && searchParams.get("type") !== "undefined") {
    condition.type = searchParams.get("type")
  }

  try {
    return NextResponse.json(await db.category.findMany({
      where: condition,
      orderBy: [
        {
          updatedAt: "desc"
        }
      ],
      take: 7
    }))
  } catch (e) {
    return NextResponse.json({ message: "Something went wrong", error: e }, { status: 400 })
  }
}

export async function POST(req) {
  const body = await req.json()
  return NextResponse.json(await db.category.create(
    {
      data: body
    }
  ))
}