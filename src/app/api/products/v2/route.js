import { db } from '@/app/db';
import { NextResponse } from 'next/server';
import crypto from "crypto";
import { product_type, sale_detail_type, user_role } from "@prisma/client";
import queryString from 'query-string';
import slugify from 'slugify';

async function deleteSaleDetailsHierarchy(tx, productId, idsToKeep = []) {
  const keepSet = new Set((idsToKeep || []).filter(Boolean));

  const allSaleDetails = await tx.sale_detail.findMany({
    where: { productId },
    select: { id: true, saleDetailId: true }
  });

  if (!allSaleDetails.length) return;

  const idsToDelete = allSaleDetails
    .filter((item) => !keepSet.has(item.id))
    .map((item) => item.id);

  if (!idsToDelete.length) return;

  // Step 1: Detach any sale_details that reference rows we're about to delete
  await tx.sale_detail.updateMany({
    where: { saleDetailId: { in: idsToDelete } },
    data: { saleDetailId: null }
  });

  // Step 2: Detach product_on_order rows that reference sale_details to delete
  await tx.product_on_order.updateMany({
    where: { saleDetailId: { in: idsToDelete } },
    data: { saleDetailId: null }
  });

  // Step 3: Delete dependent filter_value_on_sale_detail relations
  await tx.filter_value_on_sale_detail.deleteMany({
    where: { saleDetailId: { in: idsToDelete } }
  });

  // Step 4: Now safely delete all rows marked for deletion
  await tx.sale_detail.deleteMany({
    where: { id: { in: idsToDelete } }
  });
}

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

    // Pre-checks for transaction
    let existingProduct = null
    if (body.product.id) {
      existingProduct = await db.product.findFirst({ where: { id: body.product.id } });
      if (!existingProduct) {
        return NextResponse.json({ message: `Không tìm thấy sản phẩm ${body.product.id} để cập nhật` }, { status: 404 });
      }
    }

    const role = req.cookies.get("role");
    const slugChanged = !!(existingProduct && existingProduct.slug !== productBody.slug)
    if (slugChanged) {
      if (!role?.value || role?.value !== user_role.ADMIN) {
        return NextResponse.json({ message: "Bạn không có quyền cập nhật slug sản phẩm này" }, { status: 403 });
      }
    }

    // Keep DB transaction lean (no network calls) and set timeouts to avoid long locks
    await db.$transaction(async (tx) => {
      if (body.product.id) {
        await tx.product.update({ where: { id: body.product.id }, data: productBody })
      } else {
        await tx.product.create({ data: productBody })
      }

      if (saleDetails?.length) {
        await Promise.all(saleDetails.map(item => tx.sale_detail.upsert({
          where: { id: item.id },
          update: {
            productId: item.productId,
            value: item.value,
            price: item.price,
            type: item.type,
            saleDetailId: item.saleDetailId,
            filterId: item.filterId,
            filterValueId: item.filterValueId,
            sku: item.sku,
            promotionalPrice: item.promotionalPrice,
            showPrice: item.showPrice,
            inStock: item.inStock || 0,
          },
          create: {
            id: item.id,
            productId: item.productId,
            value: item.value,
            price: item.price,
            type: item.type,
            saleDetailId: item.saleDetailId,
            filterId: item.filterId,
            filterValueId: item.filterValueId,
            sku: item.sku,
            promotionalPrice: item.promotionalPrice,
            showPrice: item.showPrice,
            inStock: item.inStock || 0,
          }
        })))
      }

      const saleDetailIds = saleDetails?.map(item => item.id).filter(Boolean) || []
      await deleteSaleDetailsHierarchy(tx, productBody.id, saleDetailIds)

      if (technicalDetails?.length) {
        await Promise.all(technicalDetails.map(item => tx.technical_detail.upsert({
          where: { id: item.id },
          update: {
            productId: item.productId,
            filterId: item.filterId,
            filterValueId: item.filterValueId,
          },
          create: {
            productId: item.productId,
            filterId: item.filterId,
            filterValueId: item.filterValueId,
          }
        })))
      }

      const technicalDetailIds = technicalDetails?.map(item => item.id)
      if (!technicalDetailIds || technicalDetailIds.length === 0) {
        await tx.technical_detail.deleteMany({ where: { productId: productBody.id } });
      } else {
        await tx.technical_detail.deleteMany({ where: { productId: productBody.id, id: { notIn: technicalDetailIds } } });
      }

      const safeProductOnImages = productOnImages || []
      if (safeProductOnImages.length) {
        await Promise.all(safeProductOnImages.map(item => tx.product_on_image.upsert({
          where: { imageId_productId: { imageId: item.imageId, productId: productBody.id } },
          update: {
            order: item.order,
            imageUrl: item.imageUrl,
          },
          create: {
            order: item.order,
            imageId: item.imageId,
            imageUrl: item.imageUrl,
            productId: productBody.id
          }
        })))
      }

      const productOnImageIds = safeProductOnImages.map(item => item.imageId)
      if (!productOnImageIds || productOnImageIds.length === 0) {
        await tx.product_on_image.deleteMany({ where: { productId: productBody.id } });
      } else {
        await tx.product_on_image.deleteMany({ where: { productId: productBody.id, imageId: { notIn: productOnImageIds } } });
      }
    }, { timeout: 120000, maxWait: 10000 })

    // Perform WordPress sync outside of DB transaction to avoid timeouts
    if (slugChanged) {
      try {
        const wordpressPostRes = await fetch(`${process.env.WORDPRESS_URL}/wp-json/wp/v2/posts/?slug=${existingProduct.slug}&status=any`, {
          method: "GET",
          headers: {
            'Authorization': `Basic ${Buffer.from(`${process.env.WORDPRESS_ADMIN_USER}:${process.env.WORDPRESS_ADMIN_PASSWORD}`).toString('base64')}`
          },
        }).then(res => res.json());

        if (wordpressPostRes && wordpressPostRes.length === 1) {
          const wordpressPost = wordpressPostRes[0];
          await fetch(`${process.env.WORDPRESS_URL}/wp-json/wp/v2/posts/${wordpressPost.id}`, {
            method: "PUT",
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Basic ${Buffer.from(`${process.env.WORDPRESS_ADMIN_USER}:${process.env.WORDPRESS_ADMIN_PASSWORD}`).toString('base64')}`
            },
            body: JSON.stringify({ slug: productBody.slug })
          });
        }
      } catch (err) {
        console.log('WordPress sync failed:', err)
      }
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
  const condition = buildQueryCondition(query);

  try {
    const [result, total] = await Promise.all([
      db.product.findMany({
        select: {
          active: true,
          brandId: true,
          categoryId: true,
          createdAt: true,
          id: true,
          name: true,
          imageId: true,
          productId: true,
          slug: true,
          updatedAt: true,
          imageAlt: true,
          saleDetails: true,
          technical_detail: true,
          image: true,
          category: true,
          subCate: true,
          brand: true,
          highlight: true,
          imageUrl: true,
        },
        where: condition,
        orderBy: { updatedAt: 'desc' },
        take: size,
        skip: (page - 1) * size
      }),
      db.product.count({ where: condition })
    ]);

    return NextResponse.json({ result, total });
  } catch (e) {
    console.error('Error fetching products:', e);
    return NextResponse.json({ 
      message: 'Something went wrong', 
      error: e.message 
    }, { status: 400 });
  }
}

function buildQueryCondition(query) {
  if (!query) return {};

  const condition = {
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
  };

  if (query.id_name) {
    const slugifiedQuery = slugify(query.id_name, { locale: 'vi' }).replace(/[()]/g, '');
    console.log('Slugified Query:', slugifiedQuery);
    condition.OR = ['name', 'id', 'slug'].map(field => ({ 
      [field]: { 
        contains: field === "slug" ? slugifiedQuery : query.id_name, 
        mode: 'insensitive' 
      }}));
  }

  if (query.sku) {
    condition.saleDetails = { some: { sku: { contains: query.sku } } };
  }

  if (query.filterId || query.filterValueId) {
    const filterIds = Array.isArray(query.filterId) ? query.filterId : [query.filterId].filter(Boolean);
    const filterValueIds = Array.isArray(query.filterValueId) ? query.filterValueId : [query.filterValueId].filter(Boolean);
    
    const buildFilterCondition = (relationName) => ({
      [relationName]: {
        some: {
          AND: [
            ...(filterIds.length > 0 ? [{ filterId: { in: filterIds } }] : []),
            ...(filterValueIds.length > 0 ? [{
              OR: [
                { filterValueId: { in: filterValueIds } },
                { filterValue: { slug: { in: filterValueIds } } }
              ]
            }] : [])
          ]
        }
      }
    });

    const conditions = [];
    if (filterIds.length > 0 || filterValueIds.length > 0) {
      conditions.push(buildFilterCondition('saleDetails'));
      conditions.push(buildFilterCondition('technical_detail'));
    }

    if (conditions.length > 0) {
      condition.OR = conditions;
    }
  }

  if (query.productId) {
    condition.id = { in: Array.isArray(query.productId) ? query.productId : [query.productId] };
  }

  return condition;
}