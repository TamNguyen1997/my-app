import { NextResponse } from 'next/server'
import { db } from '@/app/db';
import { image_type } from "@prisma/client";
import slugify from 'slugify';

export async function POST(req) {
  const formData = await req.formData();
  const imageType = formData.get("type");
  const name = formData.get("name");
  const slug = slugify(name, { locale: 'vi' }).replaceAll('(', "").replaceAll(')', "").toLowerCase();

  if (!(imageType in image_type)) {
    return NextResponse.json({ message: "Image type incorrect" }, { status: 400 });
  }

  try {
    const wordpressResponse = await fetch(`${process.env.WORDPRESS_URL}/wp-json/wp/v2/media`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${process.env.WORDPRESS_ADMIN_USER}:${process.env.WORDPRESS_ADMIN_PASSWORD}`).toString('base64')}`
      },
      body: formData
    })
    const wordpressResponseData = await wordpressResponse.json();
    if (!wordpressResponse.ok) {
      return NextResponse.json({ message: "Something went wrong", wordpressResponseData }, { status: 400 });
    }
    await save(slug, wordpressResponseData.source_url, formData);
    return NextResponse.json({ message: "Image uploaded successfully" });
  } catch (e) {
    console.log(e)
    await db.image.deleteMany({ where: { slug_type: { slug: slug, type: formData.get("type") } } })
    return NextResponse.json({ message: "Something went wrong", error: e }, { status: 400 });
  }
}

const save = async (slug, path, formData) => {
  if (await db.image.findUnique({ where: { slug_type: { slug: slug, type: formData.get("type") } } })) {
    return await db.image.update({
      where: { slug_type: { slug: slug, type: formData.get("type") } },
      data: {
        path: path,
        name: formData.get("name"),
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
        name: formData.get("name"),
        slug: slug,
        alt: formData.get("alt"),
        description: formData.get("description") === "undefined" ? null : formData.get("description"),
        type: formData.get("type"),
        active: formData.get("active") ?? true
      }
    })
  }
}