import { db } from '@/app/db';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json()
    return NextResponse.json(
      await db.product.create(
        {
          data: {
            ...body,
            technicalDetails: {
              createMany: { data: body.technicalDetails ? body.technicalDetails : [] }
            },
            saleDetails: {
              createMany: { 
                data: body.saleDetails ? body.saleDetails : [] 
              }
            }
          },
          include: {
            technicalDetails: true,
            saleDetails: true
          }
        }
      )
    )
  } catch (e) {
    console.log(e)
    return NextResponse.json({ message: "Something went wrong", error: e }, { status: 400 })
  }
}

export async function GET(req) {
  try {
    return NextResponse.json(await db.product.findMany({
      include: {
        technicalDetails: true,
        saleDetails: true
      }
    }
    ))
  } catch (e) {
    return NextResponse.json({ message: "Something went wrong", error: e }, { status: 400 })
  }
}