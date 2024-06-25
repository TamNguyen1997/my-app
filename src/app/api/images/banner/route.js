import { NextResponse } from 'next/server'
import { upload } from '../util'
import { db } from '@/app/db';

export async function POST(req) {
  upload(req, "/banner")

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
        order: "desc"
      }
    ],
  })
  return NextResponse.json(result)
}