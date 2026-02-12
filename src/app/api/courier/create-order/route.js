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

    const listItem = productOnOrders
      .map((po) => {
        const saleDetail = po.saleDetail
        const product = saleDetail?.product || po.product
        if (!product) return null

        const quantity = Number.parseInt(po.quantity || "1", 10) || 1
        const weight = Number.parseInt(product.weight || "0", 10) || 0
        const length = Number.parseInt(product.length || "0", 10) || 0
        const width = Number.parseInt(product.width || "0", 10) || 0
        const height = Number.parseInt(product.height || "0", 10) || 0

        return {
          "PRODUCT_NAME": product.name,
          "PRODUCT_PRICE": saleDetail?.price ?? 0,
          "PRODUCT_WEIGHT": weight,
          "PRODUCT_LENGTH": length,
          "PRODUCT_WIDTH": width,
          "PRODUCT_HEIGHT": height,
          "PRODUCT_QUANTITY": quantity
        }
      })
      .filter(Boolean)

    const totalQuantity = listItem.reduce((sum, item) => sum + (item.PRODUCT_QUANTITY || 0), 0)
    const totalWeight = listItem.reduce((sum, item) => sum + (item.PRODUCT_WEIGHT || 0) * (item.PRODUCT_QUANTITY || 0), 0)
    const packageLength = listItem.reduce((max, item) => Math.max(max, item.PRODUCT_LENGTH || 0), 0)
    const packageWidth = listItem.reduce((max, item) => Math.max(max, item.PRODUCT_WIDTH || 0), 0)
    const packageHeight = listItem.reduce((max, item) => Math.max(max, item.PRODUCT_HEIGHT || 0), 0)

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
        "PRODUCT_QUANTITY": totalQuantity,
        "PRODUCT_WEIGHT": totalWeight,
        "PRODUCT_LENGTH": packageLength,
        "PRODUCT_WIDTH": packageWidth,
        "PRODUCT_HEIGHT": packageHeight,
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
            shippingId: result.data?.ORDER_NUMBER || data.ORDER_NUMBER
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