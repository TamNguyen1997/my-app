import { NextResponse } from 'next/server'
import { db } from '@/app/db';

export async function POST(req) {
  let body = await req.json()

  body.forEach(item => {
    delete item.image
  })

  try {
    await db.banner.deleteMany()
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
    include: {
      image: true
    },
    orderBy: [
      {
        updatedAt: "desc"
      }
    ],
  })
  return NextResponse.json(result)
}