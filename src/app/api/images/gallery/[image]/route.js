import fs from 'node:fs/promises'
import { NextResponse } from 'next/server'
import path from 'path'
import { db } from '@/app/db';

export async function DELETE(req, { params }) {
  try {

    const dir = path.resolve('./public', 'gallery');
    const blogs = await db.blog.findMany({ where: { thumbnail: { contains: `/${params.image}.` } } });
    const products = await db.product.findMany({ where: { imageUrl: { contains: `/${params.image}.` } } });

    if (blogs[0] != null || products[0] != null) {
      return NextResponse.json({ message: "Can't delete image " }, { status: 400 });
    }

    const image = await db.image.findMany({ where: { slug: params.image } });
    let pathDelete = '';
    if (image[0] != null) {
      pathDelete = image[0].path;
      pathDelete = pathDelete.replace('./public', '');
      pathDelete = pathDelete.replace('/gallery', '');
      await db.image.delete({ where: { id: image[0].id } })
      await fs.unlink(`${dir}${pathDelete}`);
      return NextResponse.json({ message: "Delete success" });
    }
    return NextResponse.json({ message: "Image not found" }, { status: 400 });
  } catch (e) {
    return NextResponse.json({ message: "Something went wrong ", error: e }, { status: 400 });
  }
}