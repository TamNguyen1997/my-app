import { db } from '@/app/db';
import { NextResponse } from 'next/server';
import queryString from 'query-string';
import { ORDER_STATUS } from "@prisma/client";
import crypto from "crypto";

export async function GET(req) {
  let page = 1
  let size = 10
  const { query } = queryString.parseUrl(req.url);
  let condition = {}

  try {
    if (query) {
      page = parseInt(query.page) || 1
      size = parseInt(query.size) || 10
    }

    if (query.paymentMethod) {
      condition.paymentMethod = query.paymentMethod
    }

    if (query.shippingOrderCreated) {
      condition.shippingOrderCreated = query.shippingOrderCreated === "true"
    }

    if (query.shippingStatus) {
      condition.shippingStatus = query.shippingStatus
    }

    const result = await db.order.findMany({
      where: condition,
      include: {
        product_on_order: {
          include: {
            product: true
          }
        }
      },
      take: size,
      skip: (page - 1) * size
    })
    return NextResponse.json({
      result,
      total: await db.order.count({
        where: condition
      })
    })

  } catch (e) {
    console.log(e)
    return NextResponse.json({ message: "Something went wrong", error: e }, { status: 400 })
  }
}

export async function POST(req) {
  try {
    const raw = await req.json()
    const order = raw.order
    const products = raw.products

    return NextResponse.json({
      order: await db.order.create({
        data: {
          address: order.address,
          email: order.email,
          name: order.name,
          phone: order.phone,
          total: order.total,
          districtId: order.districtId,
          wardId: order.wardId,
          provinceId: order.provinceId,
          status: ORDER_STATUS.PENDING,
          paymentMethod: order.payment_method,
          shippingFee: order.shippingFee,
          orderId: crypto.randomBytes(10).toString("hex"),
          companyName: order.companyName,
          companyEmail: order.companyEmail,
          companyTaxCode: order.companyTaxCode,
          companyAddress: order.companyAddress,
          product_on_order: {
            create: products.map(item => {
              return {
                productId: item.productId,
                quantity: parseInt(item.quantity || "1"),
                saleDetailId: item.saleDetailId
              }
            })
          }
        }
      })
    }, { status: 200 })
  } catch (e) {
    console.log(e)
    return NextResponse.json({ message: "Something went wrong", error: e }, { status: 400 })
  }
}