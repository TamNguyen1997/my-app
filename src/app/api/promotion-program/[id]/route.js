import { db } from "@/app/db"

export const DELETE = async (req, { params }) => {
  if (!params.id) {
    return NextResponse.json({ message: `Không tìm thấy chương trình khuyến mãi ${params.id}` }, { status: 404 })
  }
  try {
    const result = await db.promotion_program.delete({
      where: {
        id: params.id
      }
    })
    return NextResponse.json(result)
  } catch (e) {
    console.log(e)
    return NextResponse.json({ message: "Có lỗi xảy ra", error: e }, { status: 400 })
  }
}

export const GET = async (req, { params }) => {
  if (!params.id) {
    return NextResponse.json({ message: `Không tìm thấy chương trình khuyến mãi ${params.id}` }, { status: 404 })
  }
  try {
    const result = await db.promotion_program.findUnique({
      where: {
        id: params.id
      }
    })
    if (result) {
      return NextResponse.json(result)
    }
    return NextResponse.json({ message: "Chương trình khuyến mãi không tồn tại" }, { status: 404 })
  } catch (e) {
    console.log(e)
    return NextResponse.json({ message: "Có lỗi xảy ra", error: e }, { status: 400 })
  }
}