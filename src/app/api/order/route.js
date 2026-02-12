import { db } from '@/app/db';
import { NextResponse } from 'next/server';
import { ORDER_STATUS } from "@prisma/client";
import crypto from "crypto";

export async function GET(req) {
  try {
    const searchParams = req.nextUrl?.searchParams ?? new URL(req.url).searchParams;

    const page = Math.max(1, Number.parseInt(searchParams.get('page') || '1', 10) || 1);
    const sizeRaw = Number.parseInt(searchParams.get('size') || '10', 10) || 10;
    const size = Math.min(Math.max(1, sizeRaw), 100);

    const condition = {};
    const paymentMethod = searchParams.get('paymentMethod');
    if (paymentMethod) condition.paymentMethod = paymentMethod;

    const shippingOrderCreated = searchParams.get('shippingOrderCreated');
    if (shippingOrderCreated !== null && shippingOrderCreated !== undefined && shippingOrderCreated !== '') {
      condition.shippingOrderCreated = shippingOrderCreated === 'true';
    }

    const shippingStatus = searchParams.get('shippingStatus');
    if (shippingStatus) condition.shippingStatus = shippingStatus;

    const includeProducts = searchParams.get('includeProducts') === 'true';
    const include = includeProducts
      ? {
        product_on_order: {
          include: {
            product: true
          }
        }
      }
      : undefined;

    const [result, total] = await Promise.all([
      db.order.findMany({
        where: condition,
        include,
        take: size,
        skip: (page - 1) * size,
        orderBy: [{ updatedAt: "desc" }],
      }),
      db.order.count({ where: condition })
    ]);

    return NextResponse.json({ result, total }, { status: 200 });

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

    if (!order || !Array.isArray(products) || products.length === 0) {
      return NextResponse.json({ message: "Dữ liệu không hợp lệ" }, { status: 400 })
    }

    const total = Number(order.total)
    const shippingFee = Number(order.shippingFee)

    if (!Number.isFinite(total) || total <= 0) {
      return NextResponse.json({ message: "Giá không hợp lệ" }, { status: 400 })
    }
    if (order.paymentMethod === "COD" && (!Number.isFinite(shippingFee) || shippingFee <= 0)) {
      return NextResponse.json({ message: "Phí ship không hợp lệ" }, { status: 400 })
    }
    if (order.paymentMethod === "VIETQR" && total < 2000000 && (!Number.isFinite(shippingFee) || shippingFee <= 0)) {
      return NextResponse.json({ message: "Phí ship không hợp lệ" }, { status: 400 })
    }
    return NextResponse.json({
      order: await db.order.create({
        data: {
          address: order.address,
          email: order.email,
          name: order.name,
          phone: order.phone,
          total,
          districtId: order.districtId,
          wardId: order.wardId,
          provinceId: order.provinceId,
          status: ORDER_STATUS.PENDING,
          paymentMethod: order.paymentMethod,
          shippingFee: total > 2000000 ? 0 : shippingFee,
          orderId: crypto.randomBytes(10).toString("hex"),
          companyName: order.companyName,
          companyEmail: order.companyEmail,
          companyTaxCode: order.companyTaxCode,
          companyAddress: order.companyAddress,
          product_on_order: {
            create: products.map(item => {
              return {
                productId: item.productId,
                quantity: Number.parseInt(item.quantity || "1", 10),
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