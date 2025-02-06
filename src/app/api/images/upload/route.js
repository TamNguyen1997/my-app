import { NextResponse } from 'next/server'
import fs from 'node:fs/promises'
import { db } from '@/app/db';
import { image_type } from "@prisma/client";

const typeToDirs = {
  "PRODUCT": "/gallery/product",
  "BANNER": "/gallery/banner",
  "BLOG": "/gallery/blog",
}

export async function POST(req) {
  const formData = await req.formData();
  const file = formData.get("file");
  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);
  const imageType = formData.get("type");

  let name = formData.get("name");
  let slug = convertStringToSlug(name);

  try {

    if (!(imageType in image_type)) {
      return NextResponse.json({ message: "Image type incorrect" }, { status: 400 });
    }

    const extension = file.type.split("/")[1];

    if (!['png', 'jpeg', 'svg', 'webp', 'avif', 'jpg'].includes(extension)) {
      return NextResponse.json({ message: "Image extension not allow" }, { status: 400 });
    }

    const dir = typeToDirs[imageType]
    const filePath = `${dir}/${slug}.${extension}`;

    const result = await save(formData, filePath);
    fs.writeFile(`./public${filePath}`, buffer, { encoding: 'utf8', flag: 'w' });

    const formDataForWordpress = new FormData();
    formDataForWordpress.append("file", file);
    formData.append("title", convertStringToSlug(name));
    await fetch(`${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wp/v2/media`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${process.env.NEXT_PUBLIC_WORDPRESS_USER}:${process.env.NEXT_PUBLIC_WORDPRESS_PASSWORD}`).toString('base64')}`
      },
      body: formDataForWordpress
    })
    return NextResponse.json(result);
  } catch (e) {
    console.log(e)
    await db.image.deleteMany({ where: { slug_type: { slug: slug, type: formData.get("type") } } })
    return NextResponse.json({ message: "Something went wrong", error: e }, { status: 400 });
  }
}

async function save(formData, path) {

  let name = formData.get("name");
  let slug = convertStringToSlug(name);

  if (await db.image.findUnique({ where: { slug_type: { slug: slug, type: formData.get("type") } } })) {
    return await db.image.update({
      where: { slug_type: { slug: slug, type: formData.get("type") } },
      data: {
        path: path,
        name: name,
        slug: slug,
        alt: formData.get("alt"),
        description: formData.get("description") === "undefined" ? null : formData.get("description"),
        type: formData.get("type"),
        active: formData.get("active") ?? true
      }
    })
  } else {
    return await db.image.create({
      data: {
        path: path,
        name: name,
        slug: slug,
        alt: formData.get("alt"),
        description: formData.get("description") === "undefined" ? null : formData.get("description"),
        type: formData.get("type"),
        active: formData.get("active") ?? true
      }
    })
  }
}

function convertStringToSlug(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
