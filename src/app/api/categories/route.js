import { NextResponse } from 'next/server';
import { db } from '@/app/db';

export async function GET(req) {
  try {
    return NextResponse.json(await db.category.findMany())
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