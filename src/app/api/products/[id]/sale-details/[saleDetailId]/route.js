import { db } from '@/app/db';
import { NextResponse } from 'next/server';

export async function PUT(req, { params }) {
  try {
    await db.$transaction(async (tx) => {
      const body = await req.json();
      const { id, ...data } = body;
      const { saleDetailId } = params
      await tx.sale_detail_on_image.deleteMany({
        where: { saleDetailId: saleDetailId },
      });
      await tx.sale_detail_on_image.createMany({
        data: body.sale_detail_on_image.map((item) => ({ ...item, saleDetailId })),
      });
    });
    return NextResponse.json({ message: "Success" });
  } catch (e) {
    console.log(e)
    return NextResponse.json({ message: "Something went wrong", error: e }, { status: 400 })
  }
}
