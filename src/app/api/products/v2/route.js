import { db } from '@/app/db';
import { NextResponse } from 'next/server';
import crypto from "crypto";
import { product_type, sale_detail_type } from "@prisma/client";

export async function POST(req) {
  try {
    let body = await req.json()

    const productBody = {
      id: body.product.id || crypto.randomBytes(3).toString("hex"),
      name: body.product.name,
      slug: body.product.slug || slugify(body.product.name, { locale: 'vi' }).toLowerCase().replaceAll("(", "").replaceAll(")", ""),
      imageAlt: body.product.imageAlt,
      imageId: body.product.imageId,
      active: body.product.active,
      highlight: body.product.highlight,
      description: body.product.description,
      categoryId: body.product.categoryId,
      subCateId: body.product.subCateId,
      quantity: body.product.quantity,
      brandId: body.product.brandId,
      productType: body.product.productType || product_type.PRODUCT,
      width: body.product.width || 0,
      length: body.product.length || 0,
      height: body.product.height || 0,
      weight: body.product.weight || 0,
      metaTitle: body.product.metaTitle,
      metaDescription: body.product.metaDescription,
    }

    const saleDetails = body.saleDetails?.map(item => {
      return {
        id: item.id,
        productId: productBody.id,
        value: item.value,
        price: item.price,
        type: item.type || sale_detail_type.TEXT,
        saleDetailId: item.saleDetailId,
        filterId: item.filterId,
        filterValueId: item.filterValueId,
        sku: item.sku,
        promotionalPrice: item.promotionalPrice,
        showPrice: item.showPrice,
        inStock: item.inStock || 0,
      }
    })

    const technicalDetails = body.technicalDetails?.map(item => {
      return {
        id: item.id,
        productId: productBody.id,
        filterId: item.filterId,
        filterValueId: item.filterValueId,
      }
    })

    const productOnImages = body.productOnImages?.map(item => {
      return {
        order: item.order || 0,
        imageId: item.imageId,
        productId: productBody.id
      }
    })
    !body.product.id ?
      await db.product.create({ data: productBody }) :
      await db.product.update({ where: { id: body.product.id }, data: productBody })

    await db.sale_detail.deleteMany({ where: { productId: productBody.id, NOT: [{ saleDetailId: null }] } })
    await db.sale_detail.deleteMany({ where: { productId: productBody.id } })
    if (saleDetails?.length) {
      await db.sale_detail.createMany({ data: saleDetails })
    }

    await db.technical_detail.deleteMany({ where: { productId: productBody.id } })
    if (technicalDetails?.length) {
      await db.technical_detail.createMany({ data: technicalDetails })
    }

    await db.product_on_image.deleteMany({ where: { productId: productBody.id } })
    if (productOnImages?.length) {
      await db.product_on_image.createMany({ data: productOnImages })
    }

    return NextResponse.json({ id: productBody.id })
  } catch (e) {
    console.log(e)
    return NextResponse.json({ message: "Something went wrong", error: e }, { status: 400 })
  }
}
