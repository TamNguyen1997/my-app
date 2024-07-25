import { db } from '@/app/db';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json()
    const order = await db.order.create({
      data: body.order
    })

    let productOnOrders = body.products.map(item => {
      return {
        quantity: parseInt(item.quantity),
        orderId: order.id,
        productId: item.productId
      }
    })

    await db.product_on_order.createMany({
      data: productOnOrders
    })
    return NextResponse.json({ message: "Success" })

  } catch (e) {
    return NextResponse.json({ message: "Something went wrong", error: e }, { status: 400 })
  }
}