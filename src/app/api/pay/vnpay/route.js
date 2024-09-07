import { NextResponse } from 'next/server';
import dateFormat from "dateformat";

export async function POST(req) {
  try {
    const body = await req.json()
    const priceList = body["price_list"]
    let totalPrice = 0
    priceList.forEach(price => {
      totalPrice += parseInt(price)
    })
    totalPrice += parseInt(body["shipping_costs"])
    const info = `OrId${body.orderId}`

    if (!info) {
      return NextResponse.json({ message: "Không tìm thấy đơn hàng" }, { status: 400 })
    }

    var ipAddr = "127.0.0.1"

    var tmnCode = process.env.MERCHANT_CODE;
    var secretKey = process.env.VNP_HASH_SECRET;
    var vnpUrl = process.env.VNPAY_URL;
    var returnUrl = process.env.VNP_RETURN_URL;

    console.log(process.env.VNP_HASH_SECRET)
    var date = new Date();
    var expiration = new Date();
    expiration.setHours(expiration.getHours() + 1);
    var createDate = dateFormat(date, 'yyyymmddHHmmss');
    var expirationDate = dateFormat(expiration, 'yyyymmddHHmmss');
    var orderId = dateFormat(date, 'HHmmss');

    var currCode = 'VND';
    var vnp_Params = {};
    vnp_Params['vnp_Amount'] = totalPrice * 100;
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_CreateDate'] = createDate;
    vnp_Params['vnp_CurrCode'] = currCode;
    vnp_Params['vnp_ExpireDate'] = expirationDate;
    vnp_Params['vnp_IpAddr'] = ipAddr;
    vnp_Params['vnp_Locale'] = "vn";
    vnp_Params['vnp_OrderInfo'] = "Info";
    vnp_Params['vnp_OrderType'] = "other";
    vnp_Params['vnp_ReturnUrl'] = returnUrl;
    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_TmnCode'] = tmnCode;
    vnp_Params['vnp_TxnRef'] = orderId;

    vnp_Params = sortObject(vnp_Params);
    console.log(vnp_Params)

    var querystring = require('qs');
    var signData = querystring.stringify(vnp_Params, { encode: true });
    var crypto = require("crypto");
    var signed = crypto.createHmac("sha512", secretKey).update(Buffer.from(signData, 'utf-8')).digest("hex");
    vnp_Params['vnp_SecureHash'] = signed;
    vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: true });

    return NextResponse.json({ vnpUrl }, { status: 200 })
  } catch (e) {
    console.log(e)
    return NextResponse.json({ message: "Something went wrong", error: e }, { status: 400 })
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