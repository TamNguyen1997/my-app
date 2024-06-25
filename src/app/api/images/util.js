import fs from 'node:fs/promises'
import { db } from '@/app/db';

async function save(formData, path) {
  await db.image.create({
    data: {
      description: formData.get("description"),
      path: path,
      name: formData.get("name"),
      alt: formData.get("alt"),
    }
  })
}

async function upload(req, path) {
  const formData = await req.formData();
  const file = formData.get("file");
  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);

  const filePath = `./public${path}/${file.name}`

  await save(formData, filePath)
  fs.writeFile(filePath, buffer)
}

async function getFile(dir, req) {
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
  return result
}

export { upload, getFile }