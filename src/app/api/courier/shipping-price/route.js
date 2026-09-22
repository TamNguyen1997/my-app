import { NextResponse } from 'next/server';
import { db } from '@/app/db';
import { getShippingPrice } from '@/lib/courier';

export async function POST(req) {
    try {
        const raw = await req.json()
        const order = raw.order
        const products = raw.products

        const saleDetails = await db.sale_detail.findMany({ where: { id: { in: products.map(item => item.saleDetailId) } }, include: { product: true } })

        const listItem = saleDetails
            .map(item => {
                if (!item.product) return null

                const product = item.product
                const quantity = Number.parseInt(products.find(product => product.saleDetailId === item.id)?.quantity || "1", 10) || 1
                const weight = Number.parseInt(product.weight || "0", 10) || 0
                const length = Number.parseInt(product.length || "0", 10) || 0
                const width = Number.parseInt(product.width || "0", 10) || 0
                const height = Number.parseInt(product.height || "0", 10) || 0

                return {
                    "PRODUCT_NAME": product.name,
                    "PRODUCT_PRICE": item.price ?? 0,
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

        const data = {
            "PRODUCT_QUANTITY": totalQuantity,
            "PRODUCT_WEIGHT": totalWeight,
            "PRODUCT_LENGTH": packageLength,
            "PRODUCT_WIDTH": packageWidth,
            "PRODUCT_HEIGHT": packageHeight,
            "ORDER_SERVICE": process.env.VIETTEL_POST_ORDER_SERVICE,
            "SENDER_PROVINCE": "1",
            "SENDER_DISTRICT": "14",
            "RECEIVER_FULLNAME": order.name,
            "RECEIVER_ADDRESS": order.address,
            "RECEIVER_PHONE": order.phone,
            "RECEIVER_EMAIL": order.email,
            "RECEIVER_WARD": order.wardId,
            "RECEIVER_DISTRICT": order.districtId,
            "RECEIVER_PROVINCE": order.provinceId,
            "PRODUCT_TYPE": "HH",
            "NATIONAL_TYPE": 1,
            "LIST_ITEM": listItem
        }

        const result = await getShippingPrice(data);

        if (result.status == 200) {
            return NextResponse.json(result.data, { status: 200 })
        }

        data["ORDER_SERVICE"] = process.env.VIETTEL_POST_ORDER_SERVICE_RETRY;
        const resultRetry = await getShippingPrice(data)

        if (resultRetry.status == 200) {
            return NextResponse.json(resultRetry.data, { status: 200 })
        }

        return NextResponse.json({ message: result.message }, { status: 400 })
    } catch (e) {
        return NextResponse.json({ message: "Something went wrong", error: e }, { status: 400 })
    }
}

