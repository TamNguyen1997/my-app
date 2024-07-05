import { NextResponse } from 'next/server'
import { db } from '@/app/db';
import queryString from 'query-string';


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
  let condition = {}
  const { query } = queryString.parseUrl(req.url);
  if (query.type) {
    condition.type = query.type
  }

  if (query.inrange) {
    Object.assign(condition, {
      activeFrom: {
        lte: new Date()
      },

      activeTo: {
        gte: new Date()
      },
    })
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