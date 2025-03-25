import { NextResponse } from 'next/server'
import { db } from '@/app/db';
import fs from 'node:fs/promises'

export async function DELETE(req, { params }) {
  try {

    const image = await db.image.findFirst({ where: { id: params.id } });

    if (!image) return NextResponse.json({ message: "Không tìm thấy hình" }, { status: 4004 });

    const banner = await db.banner.findFirst({ where: { imageId: params.id } });

    if (banner != null) {
      return NextResponse.json({ message: `Không thể xóa. Hình này đang được dùng làm banner` }, { status: 400 });
    }
    const productOnImage = await db.product_on_image.findFirst({ where: { imageId: params.id }, include: { product: true } });

    if (productOnImage != null) {
      return NextResponse.json(
        { message: `Không thể xóa. Hình này đang được dùng làm ở sản phẩm ${productOnImage.product?.slug}` },
        { status: 400 });
    }
    const category = await db.category.findFirst({ where: { imageId: params.id } });
    if (category != null) {
      return NextResponse.json(
        { message: `Không thể xóa. Hình này đang được dùng làm ở category/subcategory ${category.slug}` },
        { status: 400 });
    }
    const products = await db.product.findFirst({ where: { imageId: params.id } });

    if (products != null) {
      return NextResponse.json(
        { message: `Không thể xóa. Hình này đang được dùng làm ở sản phẩm ${products?.slug}` },
        { status: 400 });
    }

    try {
      if (image != null) {
        await db.image.delete({ where: { id: image.id } })
        await fs.unlink(`./public${image.path}`);
        return NextResponse.json({ message: "Delete success" });
      }
    } catch (e) {
      await db.image.deleteMany({ where: { id: params.id } });
    }
    return NextResponse.json({ message: "Image not found" }, { status: 400 });
  } catch (e) {
    return NextResponse.json({ message: "Something went wrong ", error: e }, { status: 400 });
  }
}

export async function PUT(req, { params }) {
  try {
    const body = await req.json()
    await db.image.update({ where: { id: params.id }, data: body });
    return NextResponse.json({ message: "Cập nhật thành công" });
  } catch (e) {
    return NextResponse.json({ message: "Không thể cập nhật" }, { status: 400 });
  }
}