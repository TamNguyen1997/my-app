import { NextResponse } from 'next/server';
import { db } from '@/app/db';
import { ORDER_STATUS } from "@prisma/client";

export async function POST(req) {
  try {
    const raw = await req.json()
    const order = raw.order
    const products = raw.products
    const saleDetails = await db.sale_detail.findMany({ where: { id: { in: products.map(item => item.saleDetailId) } }, include: { product: true } })

    const listItem = saleDetails.map(item => {
      return {
        "PRODUCT_NAME": item.product.name,
        "PRODUCT_PRICE": item.price,
        "PRODUCT_WEIGHT": item.product.weight,
        "PRODUCT_LENGTH": 38,
        "PRODUCT_WIDTH": 40,
        "PRODUCT_HEIGHT": 25,
        "PRODUCT_QUANTITY": products.find(product => product.saleDetailId === item.id).quantity
      }
    })

    const orderCreate = await db.order.create({
      data: {
        address: order.address,
        email: order.email,
        name: order.name,
        phone: order.phone,
        total: order.total,
        status: ORDER_STATUS.PENDING,
        paymentMethod: order.payment_method
      }
    })

    const productToOrder = products.map(item => {
      return {
        productId: item.productId,
        orderId: orderCreate.id,
        quantity: parseInt(item.quantity),
        saleDetailId: item.saleDetailId
      }
    })

    await db.product_on_order.createMany({ data: productToOrder })
    if (listItem.length != 0) {
      const data = {
        "ORDER_NUMBER": orderCreate.id,
        "SENDER_FULLNAME": process.env.SAO_VIET_NAME,
        "SENDER_ADDRESS": process.env.SAO_VIET_ADDRESS,
        "SENDER_PHONE": process.env.SAO_VIET_PHONE,
        "SENDER_EMAIL": process.env.SAO_VIET_EMAIL,
        "RECEIVER_FULLNAME": order.name,
        "RECEIVER_ADDRESS": order.address,
        "RECEIVER_PHONE": order.phone,
        "RECEIVER_EMAIL": order.email,
        "RECEIVER_WARD": order.wardId,
        "RECEIVER_DISTRICT": order.districtId,
        "RECEIVER_PROVINCE": order.provinceId,
        "PRODUCT_NAME": "Giao hàng Sao Việt",
        "PRODUCT_DESCRIPTION": "Giao hàng Sao Việt",
        "PRODUCT_TYPE": "HH",
        "ORDER_PAYMENT": 3,
        "ORDER_SERVICE": process.env.VIETTEL_POST_ORDER_SERVICE,
        "ORDER_NOTE": "cho xem hàng, không cho thử",
        "LIST_ITEM": listItem
      }

      const myHeaders = new Headers();
      myHeaders.append("Token", "eyJhbGciOiJFUzI1NiJ9.eyJVc2VySWQiOjE0NzQ1MDU1LCJGcm9tU291cmNlIjo1LCJUb2tlbiI6IkUzS0xWM0FKT1NXTSIsImV4cCI6MTcyMjM5NzgxOCwiUGFydG5lciI6MTQ3NDUwNTV9.DJNHlxVCg7r1M4tNDk8ee7bt1UTWxZI83vVVHgUk-gMDOK_5Ieiz-eXCpME586A8gU4-zc8amMTD5gv3fLL94A");
      myHeaders.append("Content-Type", "application/json");

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify(data),
      };

      const res = await fetch("https://partner.viettelpost.vn/v2/order/createOrder", requestOptions);
      const result = JSON.parse(await res.text());
      if (result.status == 200) {
        return NextResponse.json({ message: "OK" }, { status: 200 })
      }

      return NextResponse.json({ message: result.message }, { status: 400 })

    }

    return NextResponse.json({ message: "Product is empty" }, { status: 400 })
  } catch (e) {
    console.log(e)
    return NextResponse.json({ message: "Something went wrong", error: e }, { status: 400 })
  }
}