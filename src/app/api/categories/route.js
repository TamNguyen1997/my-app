import { db } from '@/app/db';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json()
    return NextResponse.json(await db.category.create({ data: body }))
  } catch (e) {
    return NextResponse.json({ message: "Something went wrong", error: e }, { status: 400 })
  }
}

export async function GET(req) {
  try {
    return NextResponse.json(await db.category.findMany())
  } catch (e) {
    console.log(e)
    return NextResponse.json({ message: "Something went wrong", error: e }, { status: 400 })
  }
}