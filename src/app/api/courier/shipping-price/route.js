import { NextResponse } from 'next/server';
import { db } from '@/app/db';
import { getShippingPrice } from '@/lib/courier';

export async function POST(req) {
    try {
        const raw = await req.json()
        const order = raw.order
        const products = raw.products
        let weight = 0

        let listItem = [];

        const saleDetails = await db.sale_detail.findMany({ where: { id: { in: products.map(item => item.saleDetailId) } }, include: { product: true } })

        saleDetails.forEach(item => {
            weight += item.product.weight
            listItem.push({
                "PRODUCT_NAME": item.product.name,
                "PRODUCT_PRICE": item.price,
                "PRODUCT_WEIGHT": item.product.weight,
                "PRODUCT_LENGTH": 38,
                "PRODUCT_WIDTH": 40,
                "PRODUCT_HEIGHT": 25,
                "PRODUCT_QUANTITY": products.find(product => product.saleDetailId === item.id).quantity
            })
        })
        const data = {
            "PRODUCT_WEIGHT": weight,
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
            return NextResponse.json(result.data, { status: 200 })
        }

        return NextResponse.json({ message: result.message }, { status: 400 })
    } catch (e) {
        return NextResponse.json({ message: "Something went wrong", error: e }, { status: 400 })
    }
}

