import { db } from '@/app/db';
import { NextResponse } from 'next/server';
import queryString from 'query-string';
import CryptoJS from 'crypto-js';

const PRIVATE_KEY = process.env.PRIVATE_KEY || "private_key"

export async function POST(req) {
  try {
    const body = await req.json()
    body.password = CryptoJS.HmacSHA256(body.password, PRIVATE_KEY).toString()
    return NextResponse.json(
      await db.user.create(
        {
          data: body
        }
      )
    )
  } catch (e) {
    return NextResponse.json({ message: "Something went wrong", error: e }, { status: 400 })
  }
}

export async function GET(req) {
  let page = 1
  let size = 10
  const { query } = queryString.parseUrl(req.url);

  if (query) {
    page = parseInt(query.page) || 1
    size = parseInt(query.size) || 10
  }

  try {
    const result = await db.user.findMany({
      orderBy: [
        {
          updatedAt: "desc"
        }
      ],
      take: size,
      skip: (page - 1) * size
    })

    return NextResponse.json({ result, total: await db.user.count() })
  } catch (e) {
    return NextResponse.json({ message: "Something went wrong", error: e }, { status: 400 })
  }
}
