import fs from 'node:fs/promises'
import { NextResponse } from 'next/server'
import path from 'path'

export async function POST(req) {
  upload(req, "/gallery")

  return NextResponse.json({ message: "Upload success" })
}

export async function GET(req) {
  const dir = path.resolve('./public', 'gallery');
  const filenames = await fs.readdir(dir);
  let result = []
  const { searchParams } = new URL(req.url);
  for (let i = 0; i < filenames.length && result.length <= 20; i++) {
    if (searchParams.get('name')) {
      if (filenames[i].toLowerCase().includes(searchParams.get('name').toLowerCase())) {
        result.push(filenames[i])
      }
    } else {
      result.push(filenames[i])
    }
  }
  return NextResponse.json(result)
}

async function upload(req, path) {
  const formData = await req.formData();
  const file = formData.get("file");
  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);

  fs.writeFile(`./public${path}/${file.name}`, buffer);
}
