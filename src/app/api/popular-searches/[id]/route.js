import { NextResponse } from 'next/server'
import { db } from '@/app/db';

export async function DELETE(req, { params }) {
  if (!params.id) {
    return NextResponse.json({ message: "ID ko tồn tại" }, { status: 400 })
  }
  try {
    await db.popular_search.delete({
      where: {
        id: params.id
      }
    })
    return NextResponse.json({ message: "Thành công" })
  } catch (e) {
    console.log(new Date())
    console.log(`Không thể xóa popular search ID ${params.id}`, e)
    return NextResponse.json({ message: "Không thể xóa" }, { status: 400 })
  }
}
