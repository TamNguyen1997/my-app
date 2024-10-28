import { NextResponse } from 'next/server'
import { db } from '@/app/db';
import fs from 'node:fs/promises'

export async function DELETE(req, { params }) {
  try {

    const image = await db.image.findFirst({ where: { id: params.id } });

    if (!image) return NextResponse.json({ message: "Không tìm thấy hình" }, { status: 4004 });

    const blogs = await db.blog.findFirst({ where: { thumbnail: image.thumbnail } });
    if (blogs != null) {
      return NextResponse.json({ message: `Không thể xóa. Hình này đang được dùng ở blog ${blogs.slug}` }, { status: 400 });
    }
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

    if (image != null) {
      await db.image.delete({ where: { id: image.id } })
      await fs.unlink(`./public${image.path}`);
      return NextResponse.json({ message: "Delete success" });
    }
    return NextResponse.json({ message: "Image not found" }, { status: 400 });
  } catch (e) {
    await db.image.deleteMany({ where: { id: params.id } });
    return NextResponse.json({ message: "Something went wrong ", error: e }, { status: 400 });
  }
}