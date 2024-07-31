import { NextResponse } from 'next/server';
import { db } from '@/app/db';
import { v4 } from 'uuid';

export async function POST(req) {
  try {
    const raw = await req.json()
    console.log(raw)
    const productOnOrders = await db.product_on_order.findMany({
      where: {
        orderId: raw.orderId
      },
      include: {
        saleDetail: {
          include: {
            product: true
          }
        },
        product: true,
        order: true
      }
    })

    if (!productOnOrders.length) {
      return NextResponse.json({ message: "Không tìm thấy đơn hàng" }, { status: 201 })
    }
    const order = productOnOrders[0].order

    const saleDetails = productOnOrders.map(item => item.saleDetail)

    const listItem = saleDetails.map(item => {
      return {
        "PRODUCT_NAME": item.product.name,
        "PRODUCT_PRICE": item.price,
        "PRODUCT_WEIGHT": item.product.weight,
        "PRODUCT_LENGTH": 38,
        "PRODUCT_WIDTH": 40,
        "PRODUCT_HEIGHT": 25,
        "PRODUCT_QUANTITY": productOnOrders.find(product => product.saleDetailId === item.id).quantity
      }
    })

    if (listItem.length != 0) {
      const data = {
        "ORDER_NUMBER": order.orderId,
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
      myHeaders.append("Token", "eyJhbGciOiJFUzI1NiJ9.eyJVc2VySWQiOjE0NzQ1MDU1LCJGcm9tU291cmNlIjo1LCJUb2tlbiI6IkUzS0xWM0FKT1NXTSIsImV4cCI6MTcyMjUwNTQ2MSwiUGFydG5lciI6MTQ3NDUwNTV9.yncK9j0bxchwGPpYruIqQ9cGfqL2iIcLUE5vC5ROugFqnGQ2nMMAPR70RmE1EELR7WqCn8QJOr4Hsc-6FfapwA");
      myHeaders.append("Content-Type", "application/json");

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify(data),
      };

      const res = await fetch("https://partner.viettelpost.vn/v2/order/createOrder", requestOptions);
      const result = JSON.parse(await res.text());
      if (result.status == 200) {
        await db.order.update({
          where: {
            id: order.id
          },
          data: {
            shippingMethod: "VIETTEL_POST",
            shippingId: data.ORDER_NUMBER
          }
        })
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