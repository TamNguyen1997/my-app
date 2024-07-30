import { NextResponse } from 'next/server';
import { db } from '@/app/db';

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

        const myHeaders = new Headers();
        myHeaders.append("Token", "eyJhbGciOiJFUzI1NiJ9.eyJVc2VySWQiOjE0NzQ1MDU1LCJGcm9tU291cmNlIjo1LCJUb2tlbiI6IkUzS0xWM0FKT1NXTSIsImV4cCI6MTcyMjM5NzgxOCwiUGFydG5lciI6MTQ3NDUwNTV9.DJNHlxVCg7r1M4tNDk8ee7bt1UTWxZI83vVVHgUk-gMDOK_5Ieiz-eXCpME586A8gU4-zc8amMTD5gv3fLL94A");
        myHeaders.append("Content-Type", "application/json");

        const result = await callApi(data);

        if (result.status == 200) {
            return NextResponse.json(result.data, { status: 200 })
        }

        data["ORDER_SERVICE"] = process.env.VIETTEL_POST_ORDER_SERVICE_RETRY;
        const resultRetry = await callApi(data)

        if (resultRetry.status == 200) {
            return NextResponse.json(result.data, { status: 200 })
        }

        return NextResponse.json({ message: result.message }, { status: 400 })
    } catch (e) {
        return NextResponse.json({ message: "Something went wrong", error: e }, { status: 400 })
    }
}

async function callApi(data) {
    const myHeaders = new Headers();
    myHeaders.append("Token", "eyJhbGciOiJFUzI1NiJ9.eyJzdWIiOiIiLCJTU09JZCI6IjU4NWFmOWE0LThhYjMtNDE1Zi1hMzhmLTdjMjMwYWY1NmQ1ZCIsImludGVybmFsIjpmYWxzZSwiVXNlcklkIjoxNDc0NTA1NSwiRnJvbVNvdXJjZSI6MywiVG9rZW4iOiIxQzYwRjMxNERGQUZCRjM5NENFMTg5RTQwQjQ3MUNCMSIsInNlc3Npb25JZCI6IkNFQkFEQjYzREEzODU2N0Q5Qzg2OTFEMjBEOUU3NkFDIiwiZXhwIjoxNzIxNzIzNTE3LCJsc3RDaGlsZHJlbiI6IiIsIlBhcnRuZXIiOjAsImRldmljZUlkIjoiYzJ5eGJlYmFncnJxeDdxZTZ5ZWNscyIsInZlcnNpb24iOjF9.F5q6DJFiS8D5h2iESmZW1hNENMRdfCK0rT49VZSM8dtlkHb4_secvZPegef3TxLy596KlBw7RSZLdxxi_dy9Qg");
    myHeaders.append("Content-Type", "application/json");

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify(data),
    };

    const res = await fetch("https://partner.viettelpost.vn/v2/order/getPrice", requestOptions);
    const result = JSON.parse(await res.text());
    return result;
}

