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

    await db.order.update({
      where: {
        id: atob(body.data[0].description)
      },
      data: {
        customerPayment: body.amount,
        status: "PAID"
      }
    })
    return NextResponse.json({ message: "OK" }, { status: 200 })
  } catch (e) {
    console.log(e)
    return NextResponse.json({ message: "Something went wrong" }, { status: 400 })
  }
}