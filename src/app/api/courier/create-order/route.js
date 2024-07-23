import { NextResponse } from 'next/server';
import { db } from '@/app/db';
import { ORDER_STATUS } from "@prisma/client";

export async function POST(req) {
  try {
    const raw = await req.json()
    const order = raw.order
    const products = raw.products

    let listItem = [];
    let productSelect;
    for (let i = 0; i < products.length; i++) {
      const product = await db.product.findUnique({
        where: { id: products[i].id }, include: {
          saleDetails: { where: { id: products[i].sale_detail_id } }
        }
      })
      if (product != null) {
        if (productSelect == null) {
          productSelect = product;
        }
        listItem[i] = {
          "PRODUCT_NAME": product.name,
          "PRODUCT_PRICE": product.saleDetails[0].price,
          "PRODUCT_WEIGHT": 1000,
          "PRODUCT_QUANTITY": products[i].quantity
        }
        // total += product.saleDetails[0].price * products[i].quantity
      }
    }
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

    for (let i = 0; i < products.length; i++) {
      await db.product_on_order.create({
        data: {
          productId: products[i].id,
          orderId: orderCreate.id,
          quantity: products[i].quantity,
          saleDetailId: products[i].sale_detail_id
        }
      })
    }

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
        "PRODUCT_NAME": productSelect.name,
        "PRODUCT_DESCRIPTION": productSelect.description,
        "PRODUCT_QUANTITY": listItem[0].PRODUCT_QUANTITY,
        "PRODUCT_WEIGHT": listItem[0].PRODUCT_WEIGHT,
        "PRODUCT_LENGTH": 38,
        "PRODUCT_WIDTH": 40,
        "PRODUCT_HEIGHT": 25,
        "PRODUCT_TYPE": "HH",
        "ORDER_PAYMENT": 3,
        "ORDER_SERVICE": "VCN",
        "ORDER_NOTE": "cho xem hàng, không cho thử",
        "MONEY_TOTAL": order.total + order.shipping_price,
        "LIST_ITEM": listItem
      }

      const myHeaders = new Headers();
      myHeaders.append("Token", "eyJhbGciOiJFUzI1NiJ9.eyJzdWIiOiIiLCJTU09JZCI6IjU4NWFmOWE0LThhYjMtNDE1Zi1hMzhmLTdjMjMwYWY1NmQ1ZCIsImludGVybmFsIjpmYWxzZSwiVXNlcklkIjoxNDc0NTA1NSwiRnJvbVNvdXJjZSI6MywiVG9rZW4iOiIxQzYwRjMxNERGQUZCRjM5NENFMTg5RTQwQjQ3MUNCMSIsInNlc3Npb25JZCI6IkNFQkFEQjYzREEzODU2N0Q5Qzg2OTFEMjBEOUU3NkFDIiwiZXhwIjoxNzIxNzIzNTE3LCJsc3RDaGlsZHJlbiI6IiIsIlBhcnRuZXIiOjAsImRldmljZUlkIjoiYzJ5eGJlYmFncnJxeDdxZTZ5ZWNscyIsInZlcnNpb24iOjF9.F5q6DJFiS8D5h2iESmZW1hNENMRdfCK0rT49VZSM8dtlkHb4_secvZPegef3TxLy596KlBw7RSZLdxxi_dy9Qg");
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
    return NextResponse.json({ message: "Something went wrong", error: e }, { status: 400 })
  }
}