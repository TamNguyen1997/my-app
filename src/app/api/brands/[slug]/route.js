import { NextResponse } from 'next/server';
import { db } from '@/app/db';

export async function GET(req, { params }) {

  try {
    return NextResponse.json(await db.brand.findFirst({
      where: {
        slug: params.slug
      },
    }))
  } catch (e) {
    console.log(e)
    return NextResponse.json({ message: "Something went wrong", error: e }, { status: 400 })
  }
}