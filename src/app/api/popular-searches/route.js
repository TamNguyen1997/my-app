import { NextResponse } from 'next/server'
import { db } from '@/app/db';

export async function GET(req) {
  try {
    const result = await db.popular_search.findMany({
      include: {
        category: true
      },
      orderBy: { updatedAt: 'desc' }
    })
    return NextResponse.json({
      result,
      total: result.length
    })
  } catch (e) {
    return NextResponse.json([])
  }
}

export async function POST(req) {
  const json = await req.json()
  try {

    await db.popular_search.create({
      data: {
        categoryId: json.categoryId,
        keyword: json.keyword,
        url: json.url,
      }
    })
    return NextResponse.json({ message: "Thành công" })
  } catch (e) {
    console.log(e)
    return NextResponse.json({ message: "Không thể thêm" }, { status: 400 })
  }
}