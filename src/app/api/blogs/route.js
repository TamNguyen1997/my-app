import { db } from '@/app/db';
import { NextResponse } from 'next/server';
import queryString from 'query-string';

export async function POST(req) {
  try {
    const body = await req.json()
    if (body.id) return NextResponse.json(await db.blog.update({ where: { id: body.id }, data: body }))

    return NextResponse.json(await db.blog.create({ data: body }))
  } catch (e) {
    return NextResponse.json({ message: "Something went wrong", error: e }, { status: 400 })
  }
}

export async function GET(req) {
  try {
    const { query } = queryString.parseUrl(req.url);

    let condition = {}

    if (query.blogCategory) {
      condition.blogCategory = query.blogCategory
    }

    return NextResponse.json(await db.blog.findMany({
      where: condition
    }))
  } catch (e) {
    return NextResponse.json({ message: "Something went wrong", error: e }, { status: 400 })
  }
}