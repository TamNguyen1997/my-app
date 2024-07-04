import { NextResponse } from 'next/server';
import { db } from '@/app/db';

export async function GET(req) {

  try {
    return NextResponse.json(await db.brand.findMany({
      orderBy: [
        {
          updatedAt: "desc"
        }
      ],
    }))
  } catch (e) {
    return NextResponse.json({ message: "Something went wrong", error: e }, { status: 400 })
  }
}