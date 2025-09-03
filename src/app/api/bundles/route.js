import { NextResponse } from 'next/server';
import { db } from '@/app/db';

export async function POST(req, res) {
  const { productIds, bundleId } = await req.json();

  if (!Array.isArray(productIds) || productIds.length === 0) {
    return res.status(400).json({ error: 'productIds is required and must be a non-empty array.' });
  }

  let bundle;
  if (bundleId) {
    if (!(await db.bundle.findUnique({ where: { id: bundleId } }))) {
      return NextResponse.json({ message: "Khong tìm thấy gói sản phẩm" }, { status: 404 })
    }

    await db.bundle_product.deleteMany({ where: { bundleId } });
    const relations = productIds.map(productId => ({
      bundleId,
      productId,
    }));
    await db.bundle_product.createMany({ data: relations });
    bundle = await db.bundle.findUnique({
      where: { id: bundleId },
      include: { bundleProducts: true },
    });
  } else {
    bundle = await db.bundle.create({
      data: {
        bundleProducts: {
          create: productIds.map(productId => ({ productId })),
        },
      },
      include: { bundleProducts: true },
    });
  }

  return NextResponse.json(bundle)
}