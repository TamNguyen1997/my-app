import { db } from '@/app/db';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  try {
    return NextResponse.json(
      await db.filter.findFirst({
        where: { id: params.id },
        include: {
          filterValue: {
            include: {
              brands: true,
              categories: true,
              subCategories: true
            },
          }
        }
      })
    )
  } catch (e) {
    return NextResponse.json({ message: "Something went wrong", error: e }, { status: 400 })
  }
}