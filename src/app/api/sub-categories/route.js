import { db } from '@/app/db';
import { NextResponse } from 'next/server';

export async function GET(req) {
  return NextResponse.json(await db.subCategory.findMany())
}

export async function POST(req) {
  const body = await req.json()
  return NextResponse.json(await db.subCategory.create(
    {
      data: body
    }
  ))
}