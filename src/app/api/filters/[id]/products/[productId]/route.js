import { db } from '@/app/db';
import { NextResponse } from 'next/server';

export async function DELETE(req, { params }) {
  try {
    console.log(await db.filter_on_product.findMany({
      where: {
        filterId: params.id,
        productId: params.productId
      }
    }))
    return NextResponse.json(await db.filter_on_product.deleteMany({
      where: {
        filterId: params.id,
        productId: params.productId
      }
    }))
  } catch (e) {
    console.log(e)
    return NextResponse.json({ message: "Something went wrong", error: e }, { status: 400 })
  }
}
