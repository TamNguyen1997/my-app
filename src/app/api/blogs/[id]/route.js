import { db } from '@/app/db';
import { NextResponse } from 'next/server';

const SUPPORT_SLUGS = ["ho-tro", "chinh-sach-bao-mat", "hop-tac-ban-hang", "chinh-sach-doi-tra", "chinh-sach-bao-hanh",
  "huong-dan-mua-hang", "hinh-thuc-thanh-toan", "hinh-thuc-van-chuyen", "doi-tac", "khach-hang"]

export async function GET(req, { params }) {
  try {
    let result = await db.blog.findFirst({ where: { slug: params.id } })
    if (!result) {
      if (SUPPORT_SLUGS.includes(params.id)) {
        result = await db.blog.create({ data: { slug: params.id, content: "<p></p>", title: params.id } })
      } else {
        return NextResponse.json({ message: "Blog not found" }, { status: 404 })
      }
    }
    return NextResponse.json(result)
  } catch (e) {
    console.log(e)
    return NextResponse.json({ message: "Something went wrong", error: e }, { status: 400 })
  }
}

export async function PUT(req, { params }) {
  try {
    const json = await req.json()
    const result = await db.blog.update({ where: { id: params.id }, data: { active: json.active } })

    return NextResponse.json(result)
  } catch (e) {
    console.log(e)
    return NextResponse.json({ message: "Something went wrong", error: e }, { status: 400 })
  }
}

export async function DELETE(req, { params }) {
  try {
    return NextResponse.json(await db.blog.delete({ where: { id: params.id } }))
  } catch (e) {
    return NextResponse.json({ message: "Something went wrong", error: e }, { status: 400 })
  }
}