import { db } from '@/app/db';
import { NextResponse } from 'next/server';
import crypto from "crypto";
import { product_type, sale_detail_type } from "@prisma/client";
import queryString from 'query-string';
import slugify from 'slugify';

export async function POST(req) {
  try {
    let body = await req.json()

    const productBody = {
      id: body.product.id || crypto.randomBytes(3).toString("hex"),
      name: body.product.name,
      slug: body.product.slug || slugify(body.product.name, { locale: 'vi' }).toLowerCase().replaceAll("(", "").replaceAll(")", ""),
      imageAlt: body.product.imageAlt,
      imageUrl: body.product.imageUrl,
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
      promotion: body.product.promotion,
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
        imageUrl: item.imageUrl,
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


export async function GET(req) {
  const { query } = queryString.parseUrl(req.url);
  const page = parseInt(query.page) || 1;
  const size = parseInt(query.size) || 10;
  let condition = {};

  if (query) {
    Object.assign(condition, {
      ...(query.highlight && { highlight: query.highlight === 'true' }),
      ...(query.categoryId && { categoryId: { in: query.categoryId.split(',') } }),
      ...(query.subCateId && { subCateId: { in: query.subCateId.split(',') } }),
      ...(query.active && { active: query.active === 'true' }),
      ...(query.name && { name: { contains: query.name } }),
      ...(query.slug && { slug: { contains: query.slug } }),
      ...(query.productType && { productType: query.productType }),
      ...(query.thumbnail === 'true' && { imageUrl: { not: null } }),
      ...(query.thumbnail === 'false' && { imageUrl: null }),
      ...(query.brandId && { brand: { slug: query.brandId } })
    });

    if (query.id_name) {
      const slugifiedQuery = slugify(query.id_name, { locale: 'vi' }).replace(/[()]/g, '');
      condition.OR = ['name', 'id', 'slug'].map(field => ({ [field]: { contains: field === "slug" ? slugifiedQuery : query.id_name } }));
    }

    if (query.sku) {
      condition.saleDetails = { some: { sku: { contains: query.sku } } };
    }

    let productIds = query.productId ? [query.productId] : [];

    if (query.filterId || query.filterValueId) {
      const filterIds = Array.isArray(query.filterId || []) ? query.filterId : [query.filterId];
      const filterValueIds = Array.isArray(query.filterValueId || []) ? query.filterValueId : [query.filterValueId];
      let saleDetailCondition = condition.saleDetails || { saleDetails: { some: {} } }
      saleDetailCondition.saleDetails.some.AND = [
        { filterId: { in: filterIds } },
        {
          OR: [
            { filterValueId: { in: filterValueIds } },
            { filterValue: { slug: { in: filterValueIds } } }
          ]
        }
      ]

      let technicalDetailCondition = condition.technical_detail || { technical_detail: { some: {} } }

      technicalDetailCondition.technical_detail.some.AND = [
        { filterId: { in: filterIds } },
        {
          OR: [
            { filterValueId: { in: filterValueIds } },
            { filterValue: { slug: { in: filterValueIds } } }
          ]
        }
      ]

      Object.assign(condition, {
        OR: [
          saleDetailCondition,
          technicalDetailCondition
        ]
      })
    }

    if (productIds.length) condition.id = { in: productIds };
  }

  console.log(condition.OR)

  try {
    const result = await db.product.findMany({
      select: {
        active: true, brandId: true, categoryId: true, createdAt: true, id: true,
        name: true, imageId: true, productId: true, slug: true, updatedAt: true,
        imageAlt: true, saleDetails: true, technical_detail: true, image: true,
        category: true, subCate: true, brand: true, highlight: true, imageUrl: true,
      },
      where: condition,
      orderBy: { updatedAt: 'desc' },
      take: size,
      skip: (page - 1) * size
    });

    const total = await db.product.count({ where: condition });
    return NextResponse.json({ result, total });
  } catch (e) {
    console.log(e)
    return NextResponse.json({ message: 'Something went wrong', error: e }, { status: 400 });
  }
}