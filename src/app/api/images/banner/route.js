import { NextResponse } from 'next/server'
import path from 'path'
import { upload, getFile } from '../util'

export async function POST(req) {
  upload(req, "/banner")

  return NextResponse.json({ message: "Upload success" })
}

export async function GET(req) {
  const dir = path.resolve('./public', 'banner');
  return NextResponse.json(getFile(dir, req))
}
