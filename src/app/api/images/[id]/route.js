import { NextResponse } from 'next/server'
import { db } from '@/app/db';
import fs from 'node:fs/promises'

export async function DELETE(req, { params }) {
  try {

    const image = await db.image.findFirst({ where: { id: params.id } });

    if (!image) return NextResponse.json({ message: "Image not found" }, { status: 4004 });

    const blogs = await db.blog.findFirst({ where: { thumbnail: { contains: `/${params.image}.` } } });
    const products = await db.product.findFirst({ where: { imageId: params.id } });

    if (blogs != null || products != null) {
      return NextResponse.json({ message: "Can't delete image" }, { status: 400 });
    }

    if (image != null) {
      await db.image.delete({ where: { id: image.id } })
      await fs.unlink(`./public${image.path}`);
      return NextResponse.json({ message: "Delete success" });
    }
    return NextResponse.json({ message: "Image not found" }, { status: 400 });
  } catch (e) {
    return NextResponse.json({ message: "Something went wrong ", error: e }, { status: 400 });
  }
}