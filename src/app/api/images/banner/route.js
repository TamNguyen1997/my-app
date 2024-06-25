import { NextResponse } from 'next/server'
import { db } from '@/app/db';

export async function POST(req) {
  const body = await req.json()

  try {
    await db.banner.createMany({ data: body })
  } catch (e) {
    return NextResponse.json({ message: "Something went wrong", error: e }, { status: 400 })
  }

  return NextResponse.json({ message: "Upload success" })
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);

  let condition = {}

  if (searchParams.get("type")) {
    condition.type = searchParams.get("type")
  }

  const result = await db.banner.findMany({
    where: condition,
    orderBy: [
      {
        updatedAt: "desc"
      }
    ],
  })
  return NextResponse.json(result)
}