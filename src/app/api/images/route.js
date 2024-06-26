import { NextResponse } from 'next/server'
import { db } from '@/app/db';

export async function GET(req) {
  const { searchParams } = new URL(req.url);

  let condition = {}

  if (searchParams.get("type") && searchParams.get("type") !== "undefined") {
    condition.type = searchParams.get("type")
  }

  if (searchParams.get("name") && searchParams.get("name") !== "undefined") {
    condition.name = { search: `${searchParams.get("name")}:*` }
  }

  try {
    return NextResponse.json(await db.image.findMany({ where: condition }))

  } catch (e) {
    console.log(e)
    return NextResponse.json([])
  }
}