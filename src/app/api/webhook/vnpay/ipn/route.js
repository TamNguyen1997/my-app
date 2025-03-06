import { NextResponse } from 'next/server';
import { db } from '@/app/db';
import queryString from 'query-string';

export async function GET(req) {
  const { query } = queryString.parseUrl(req.url);

  console.log(
    `${new Date(new Date().toLocaleString('en', { timeZone: 'Asia/Ho_Chi_Minh' }))}, Received IPN request for order ${query.vnp_TxnRef} from IP ${(req.headers['x-forwarded-for'] || req.connection.remoteAddress).split(',')[0].trim()}`,
    req.method, req.url, req.protocol, req.headers['user-agent'])
  console.log(`Received IPN request for order: ${query.vnp_TxnRef}`)
  try {
    if (query.vnp_TmnCode !== process.env.MERCHANT_CODE) {
      console.log(`MERCHANT_CODE not match: ${query.vnp_TxnRef}`)
      return NextResponse.json({ message: "MERCHANT_CODE not match" }, { status: 401 })
    }

    if (!query.vnp_Amount) {
      console.log(`vnp_Amount missing: ${query.vnp_TxnRef}`)
      return NextResponse.json({ message: "vnp_Amount missing" }, { status: 400 })
    }

    if (!query.vnp_OrderInfo) {
      console.log(`vnp_OrderInfo missing: ${query.vnp_TxnRef}`)
      return NextResponse.json({ message: "vnp_OrderInfo missing" }, { status: 400 })
    }

    const description = query.vnp_OrderInfo
    const orderId = description.split("OrId")[1].substring(0, 20)
    var secureHash = query['vnp_SecureHash'];
    delete query['vnp_SecureHash'];
    delete query['vnp_SecureHashType'];

    let vnp_Params = sortObject({ ...query });
    vnp_Params['vnp_Amount'] = parseInt(vnp_Params['vnp_Amount']);
    var secretKey = process.env.VNP_HASH_SECRET;
    var querystring = require('qs');
    var signData = querystring.stringify(vnp_Params, { encode: true });
    var crypto = require("crypto");
    var signed = crypto.createHmac("sha512", secretKey).update(Buffer.from(signData, 'utf-8')).digest("hex");

    let data = {
      customerPayment: parseInt(query.vnp_Amount) / 100,
      vnpayTransactionNo: query.vnp_TransactionNo,
      bankTransactionNo: query.vnp_BankTranNo,
      bankCode: query.vnp_BankCode,
      vnpayResponseCode: parseInt(query.vnp_ResponseCode),
      vnpayTransactionStatus: parseInt(query.vnp_TransactionStatus),
      vnpayTxtRef: query.vnp_TxnRef,
      vnpayHashType: query.vnp_SecureHashType,
      vnpaySecureHash: query.vnp_SecureHash,
    }

    data.log = JSON.stringify(query)
    if (query['vnp_ResponseCode'] !== "00") {
      data.status = "FAILED"
      data.log = JSON.stringify(query)
    } else if (secureHash === signed) {
      data.status = "PAID"
      data.log = null
    }
    if (signed !== secureHash) {
      console.log(`Invalid Checksum for order: ${query.vnp_TxnRef}`)
      return NextResponse.json({ RspCode: "97", Message: 'Invalid Checksum' })
    }
    const existOrder = await db.order.findFirst({ where: { vnpayTxtRef: query.vnp_TxnRef } })
    if (!existOrder) {
      console.log(`Order not found: ${query.vnp_TxnRef}`)
      return NextResponse.json({ RspCode: "01", Message: 'Order Not Found' })
    }

    if ((existOrder.total + existOrder.shippingFee) !== (parseInt(query.vnp_Amount) / 100)) {
      console.log(`Invalid amount for order: ${query.vnp_TxnRef}`)
      return NextResponse.json({ RspCode: "04", Message: 'Invalid amount' })
    }
    if (existOrder.status === "PAID") {
      console.log(`Order already confirmed: ${query.vnp_TxnRef}`)
      return NextResponse.json({ RspCode: "02", Message: 'Order already confirmed' })
    }
    await db.order.updateMany({
      where: {
        orderId: orderId
      },
      data: data
    })

    console.log(`Order ${orderId} updated with status ${data.status}`)
    return NextResponse.json({ RspCode: "00", Message: query['vnp_ResponseCode'] === "00" ? "Success" : 'Fail' })
  } catch (e) {
    console.log(e)
    return NextResponse.json(e, { status: 400 })
  }
}

function sortObject(o) {
  return Object.keys(o).sort().reduce(
    (obj, key) => {
      obj[key] = o[key];
      return obj;
    },
    {}
  );

}