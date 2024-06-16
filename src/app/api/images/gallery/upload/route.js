import { NextResponse } from 'next/server'
import fs from 'node:fs/promises'
import { db } from '@/app/db';
import { image_type } from "@prisma/client";
import moment from 'moment';

export async function POST(req) {
  try {
    const formData = await req.formData()
    const file = formData.get("file")
    const arrayBuffer = await file.arrayBuffer()
    const buffer = new Uint8Array(arrayBuffer)
    const imageType = formData.get("type")

    if (!(imageType in image_type)) {
      return NextResponse.json({ message: "Image type incorrect" })
    }

    const filePath = `./public/gallery/${imageType.toLowerCase()}/${file.name}`

    await save(formData, filePath)
    fs.writeFile(filePath, buffer)

    return NextResponse.json({ message: "Upload success" })
  } catch (e) {
    return NextResponse.json({ message: "Something went wrong", error: e }, { status: 400 })
  }
}

async function save(formData, path) {
  let activeFrom = formData.get("active_from")
  activeFrom = activeFrom != null ? moment(activeFrom).toDate() : null

  let activeTo = formData.get("active_to")
  activeTo = activeTo != null ? moment(activeTo).toDate() : null

  console.log({
    path: path,
    name: formData.get("name"),
    alt: formData.get("alt"),
    description: formData.get("description"),
    type: formData.get("type"),
    active: formData.get("active") ?? true,
    activeFrom: activeFrom,
    activeTo: activeTo,
    order: formData.get("order"),
  })
  await db.image.create({
    data: {
      path: path,
      name: formData.get("name"),
      alt: formData.get("alt"),
      description: formData.get("description"),
      type: formData.get("type"),
      active: formData.get("active") ?? true,
      activeFrom: activeFrom,
      activeTo: activeTo,
      order: formData.get("order"),
    }
  })
}
