import { NextResponse } from 'next/server';
import { db } from '@/app/db';

export async function POST(req) {
    try {
        const raw = await req.json()
        const order = raw.order
        const products = raw.products;
        let total = 0

        for (let i = 0; i < products.length; i++) {
            const product = await db.product.findUnique({
                where: { id: products[i].id }, include: {
                    saleDetails: { where: { id: products[i].sale_detail_id } }
                }
            })
            if (product != null) {
                total += product.saleDetails[0].price * products[i].quantity
            }
        }

        let data = {
            "PRODUCT_WEIGHT": order.weight ?? 0,
            "PRODUCT_PRICE": total,
            "ORDER_SERVICE_ADD": "",
            "ORDER_SERVICE": process.env.VIETTEL_POST_ORDER_SERVICE,
            "SENDER_ADDRESS": process.env.SAO_VIET_ADDRESS,
            "RECEIVER_ADDRESS": order.address,
            "PRODUCT_TYPE": "HH",
            "NATIONAL_TYPE": 1
        }

        const result = await callApi(data);
        if (result.status == 200) {
            return NextResponse.json({ total: total, shopping_price: result.data.MONEY_TOTAL, order_service: process.env.VIETTEL_POST_ORDER_SERVICE }, { status: 200 })
        }

        data["ORDER_SERVICE"] = process.env.VIETTEL_POST_ORDER_SERVICE_RETRY;
        const resultRetry = await callApi(data)

        if (resultRetry.status == 200) {
            return NextResponse.json({ total: total, shopping_price: resultRetry.data.MONEY_TOTAL, order_service: process.env.VIETTEL_POST_ORDER_SERVICE_RETRY }, { status: 200 })
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

    const res = await fetch("https://partner.viettelpost.vn/v2/order/getPriceNlp", requestOptions);
    const result = JSON.parse(await res.text());
    return result;
}

const getPrice = (saleDetail, secondarySaleDetail) => {
    if (!secondarySaleDetail && !saleDetail) return 0
    if (!secondarySaleDetail.price && saleDetail.price) return saleDetail.price
    if (secondarySaleDetail.price) return secondarySaleDetail.price

    return 0
}

