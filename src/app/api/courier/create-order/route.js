import { NextResponse } from 'next/server';
import { db } from '@/app/db';
import { createOrder } from '@/lib/courier';

export async function POST(req) {
  try {
    const raw = await req.json()
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
        "PRODUCT_LENGTH": item.product.length,
        "PRODUCT_WIDTH": item.product.width,
        "PRODUCT_HEIGHT": item.product.height,
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

      const result = await createOrder(data);
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