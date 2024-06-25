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
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);
    const imageType = formData.get("type");

    let name = formData.get("name");
    let slug = convertStringToSlug(name);

    let oldImage = await db.image.findMany({ where: { slug: slug, type: imageType } })

    if (oldImage[0] != null) {
      return NextResponse.json({ message: "Name already exists " }, { status: 400 });
    }

    if (!(imageType in image_type)) {
      return NextResponse.json({ message: "Image type incorrect" }, { status: 400 });
    }

    const extension = file.type.split("/")[1];

    if (!['png', 'jpeg', 'svg'].includes(extension)) {
      return NextResponse.json({ message: "Image extension not allow" }, { status: 400 });
    }

    const dir = typeToDirs[imageType]
    const filePath = `${dir}/${slug}.${extension}`;

    console.log(filePath)
    console.log(`./public${filePath}`)
    await save(formData, filePath);
    fs.writeFile(`./public${filePath}`, buffer);

    return NextResponse.json({ message: "Upload success" });
  } catch (e) {
    console.log(e)
    return NextResponse.json({ message: "Something went wrong", error: e }, { status: 400 });
  }
}

async function save(formData, path) {

  let name = formData.get("name");
  let slug = convertStringToSlug(name);

  await db.image.create({
    data: {
      path: path,
      name: name,
      slug: slug,
      alt: formData.get("alt"),
      description: formData.get("description"),
      type: formData.get("type"),
      active: formData.get("active") ?? true
    }
  })
}

function convertStringToSlug(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
