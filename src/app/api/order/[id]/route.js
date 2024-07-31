import { db } from '@/app/db';
import { NextResponse } from 'next/server';

export async function DELETE(req, { params }) {
  try {
    return NextResponse.json(await db.order.delete({ where: { id: params.id } }))
  } catch (e) {
    return NextResponse.json({ message: "Something went wrong", error: e }, { status: 400 })
  }
}

export async function GET(req, { params }) {
  try {
    return NextResponse.json(await db.order.findFirst({
      where: { id: params.id },
      include: {
        product_on_order: {
          include: {
            saleDetail: {
              include: {
                product: {
                  include: {
                    image: true
                  }
                }
              }
            }
          }
        }
      }
    }))
  } catch (e) {
    console.log(e)
    return NextResponse.json({ message: "Something went wrong", error: e }, { status: 400 })
  }
}

export async function PUT(req, { params }) {
  try {
    return NextResponse.json(await db.order.update({ where: { id: params.id }, data: await req.json() }))
  } catch (e) {
    return NextResponse.json({ message: "Something went wrong", error: e }, { status: 400 })
  }
}