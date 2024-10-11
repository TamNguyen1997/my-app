import { db } from '@/app/db';
import { NextResponse } from 'next/server';
import queryString from 'query-string';
import { parse } from 'uuid';


export async function GET(req, { params }) {
  if (!params.id) {
    return NextResponse.json({ message: `Resource not found ${params.id}` }, { status: 400 })
  }
  try {
    const { query } = queryString.parseUrl(req.url);
    const { searchParams } = new URL(req.url);

    let condition = {}
    let include = {
      technical_detail: {
        include: {
          filterValue: true,
          filter: true
        }
      },
      saleDetails: searchParams && searchParams.get("includeSale") !== "undefined" && searchParams.get("includeSale") !== null,
      image: true,
      category: true,
      subCate: true,
      brand: true
    }

    if (query.includeSale === "true") {
      include.saleDetails = {
        include: {
          filterValue: true,
          filter: true
        }
      }
    }

    try {
      parse(params.id)
      condition = { id: params.id }
    } catch (e) {
      condition = { slug: params.id }
    }

    return NextResponse.json(await db.product.findFirst(
      {
        where: condition,
        include: include
      }
    ))
  } catch (e) {
    console.log(e)
    return NextResponse.json({ message: "Something went wrong", error: e }, { status: 400 })
  }
}

export async function PUT(req, { params }) {
  if (!params.id) {
    return NextResponse.json({ message: `Resource not found ${params.id}` }, { status: 400 })
  }

  let body = await req.json()

  delete body.saleDetails
  delete body.image
  delete body.category
  delete body.subCategory
  delete body.technical_detail

  if (!body) return NextResponse.json({ message: "Invalid request body" }, { status: 400 })
  try {
    return NextResponse.json(await db.product.update({ where: { id: params.id }, data: body, include: { image: true } }))
  } catch (e) {
    return NextResponse.json({ message: "Something went wrong", error: e }, { status: 400 })
  }
}

export async function DELETE(req, { params }) {
  if (!params.id) {
    return NextResponse.json({ message: `Resource not found ${params.id}` }, { status: 400 })
  }

  try {
    await db.$transaction(async tx => {
      await tx.technical_detail.deleteMany({ where: { productId: params.id } })
      await tx.sale_detail.deleteMany({
        where: {
          productId: params.id,
          NOT: [
            {
              saleDetailId: null
            }
          ]
        }
      })
      await tx.sale_detail.deleteMany({
        where: {
          productId: params.id
        }
      })
      await tx.product.delete({ where: { id: params.id } })
    })
    return NextResponse.json({ message: "Success" })
  } catch (e) {
    console.log(e)
    return NextResponse.json({ message: "Sản phẩm đã đặt hàng", error: e }, { status: 400 })
  }
}
