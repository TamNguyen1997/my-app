import fs from 'node:fs/promises'
import { NextResponse } from 'next/server'
import path from 'path'

export async function DELETE(req, { params }) {
  const dir = path.resolve('./public', 'gallery');
  await fs.unlink(`${dir}/${params.image}`);

  return NextResponse.json({ message: "Upload success" })
}
