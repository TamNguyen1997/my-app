import { NextResponse } from 'next/server';
import { db } from '@/app/db';
import { headers } from 'next/headers';

export async function POST(req) {
  try {
    const headerList = headers()
    console.log(headerList.get("secure-token"))
    if (headerList.get("secure-token") !== process.env.CASSO_API_KEY) {
      console.log("Unauthenticated")
      return NextResponse.json({ message: "Không hợp lệ" }, { status: 401 })
    }
    const body = await req.json()
    console.log(body)
    if (!body || !body.data?.length || !body.data[0].description) {
      console.log("Body not found")
      return NextResponse.json({ message: "Không hợp lệ" }, { status: 400 })
    }

    const description = body.data[0].description
    const amount = body.data[0].amount || 0

    console.log(body.data[0].amount)

    console.log(description.split("OrId")[1].substring(0, 19))
    const orderId = description.split("OrId")[1].substring(0, 19)
    await db.order.updateMany({
      where: {
        orderId: orderId
      },
      data: {
        customerPayment: amount,
        status: "PAID"
      }
    })
    return NextResponse.json({ message: "OK" }, { status: 200 })
  } catch (e) {
    console.log(e)
    return NextResponse.json({ message: "Something went wrong" }, { status: 400 })
  }
}