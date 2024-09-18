import { NextResponse } from 'next/server';
import { db } from '@/app/db';
import queryString from 'query-string';

export async function GET(req) {
  const { query } = queryString.parseUrl(req.url);

  try {
    console.log("?????????????????")
    console.log(query.vnp_OrderInfo)
    console.log(query)
    if (query.vnp_TmnCode !== process.env.MERCHANT_CODE) {
      return NextResponse.json({ message: "MERCHANT_CODE not match" }, { status: 401 })
    }

    if (!query.vnp_Amount) {
      return NextResponse.json({ message: "vnp_Amount missing" }, { status: 400 })
    }

    if (!query.vnp_OrderInfo) {
      return NextResponse.json({ message: "vnp_Amount missing" }, { status: 400 })
    }

    const description = query.vnp_OrderInfo
    const orderId = description.split("OrId")[1].substring(0, 20)

    await db.order.updateMany({
      where: {
        orderId: orderId
      },
      data: {
        customerPayment: parseInt(query.vnp_Amount) / 100,
        vnpayTransactionNo: query.vnp_TransactionNo,
        bankTransactionNo: query.vnp_BankTranNo,
        bankCode: query.vnp_BankCode,
        vnpayResponseCode: parseInt(query.vnp_ResponseCode),
        vnpayTransactionStatus: parseInt(query.vnp_TransactionStatus),
        vnpayTxtRef: query.vnp_TxnRef,
        vnpayHashType: query.vnp_SecureHashType,
        vnpaySecureHash: query.vnp_SecureHash,
        status: "PAID"
      }
    })
    return NextResponse.redirect("https://dcvs.shop/thanh-toan/thanh-cong")
  } catch (e) {
    console.log(e)
    return NextResponse.json(e, { status: 400 })
  }
}