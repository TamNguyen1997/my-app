import { NextResponse } from 'next/server';
import { db } from '@/app/db';

export async function GET(req) {
  let include = { image: true }

  include.subcates = {
    include: {
      image: true
    }
  }

  try {
    const result = await db.category.findMany({
      where: {
        slug: {
          in: [
            "khan",
            "hop-thung-dung-do-da-nang",
            "xe-day-phuc-vu",
            "gang-tay-chuyen-dung",
            "dung-cu-ve-sinh",
            "cac-thiet-bi-khac",
            "dung-cu-ve-sinh-kinh"
          ]
        }
      },
      orderBy: [
        {
          updatedAt: "desc"
        }
      ],
      include: {
        subcates: {
          include: {
            image: true
          }
        }
      }
    })

    return NextResponse.json({ result })
  } catch (e) {
    console.log(e)
    return NextResponse.json({ message: "Something went wrong", error: e }, { status: 400 })
  }
}
