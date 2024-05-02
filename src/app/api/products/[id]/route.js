import { db } from '@/app/db';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  if (!params.id) {
    return NextResponse.json({ message: `Resource not found ${params.id}` }, { status: 400 })
  }
  try {
    return NextResponse.json(await db.product.findFirst(
      {
        where: { id: params.id },
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

export async function PUT(req, { params }) {
  if (!params.id) {
    return NextResponse.json({ message: `Resource not found ${params.id}` }, { status: 400 })
  }

  const body = await req.json()

  if (!body) return NextResponse.json({ message: "Invalid request body" }, { status: 400 })
  try {
    const data = await db.product.update(
      {
        where: { id: params.id },
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
    return NextResponse.json(data)
  } catch (e) {
    console.log(e)
    return NextResponse.json({ message: "Something went wrong", error: e }, { status: 400 })
  }
}

export async function DELETE(req, { params }) {
  if (!params.id) {
    return NextResponse.json({ message: `Resource not found ${params.id}` }, { status: 400 })
  }

  try {
    return NextResponse.json(await db.product.delete({ where: { id: params.id } }))
  } catch (e) {
    return NextResponse.json({ message: "Something went wrong", error: e }, { status: 400 })
  }
}