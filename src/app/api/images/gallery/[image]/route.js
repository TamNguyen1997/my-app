import { NextResponse } from 'next/server'
import path from 'path'
import { upload, getFile } from '../../util'

export async function POST(req) {
  upload(req, "/gallery")

  return NextResponse.json({ message: "Upload success" })
}

export async function GET(req) {
  const dir = path.resolve('./public', 'gallery');
  return NextResponse.json(getFile(dir, req))
}
