import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json()
    const priceList = body["price_list"]
    let totalPrice = 0
    priceList.forEach(price => {
      totalPrice += price
    })
    totalPrice += body["shipping_costs"]
    const info = `THANH TOAN DH ${body["order_code"]}`

    return NextResponse.json({ qr: `https://img.vietqr.io/image/${process.env.BANK_ID}-${process.env.ACCOUNT_NO}-${process.env.TEMPLATE}.jpg?amount=${totalPrice}&addInfo=${info}&accountName=${process.env.ACCOUNT_NAME}`, status: 200 })
  } catch (e) {
    return NextResponse.json({ message: "Something went wrong", error: e }, { status: 400 })
  }
}