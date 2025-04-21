import { db } from '@/app/db';
import { NextResponse } from 'next/server';

export async function PUT(req, { params }) {
  try {
    await db.$transaction(async (tx) => {
      const body = await req.json();
      const { id, ...data } = body;
      const { saleDetailId } = params
      await tx.technical_detail_for_sale_detail.deleteMany({
        where: { saleDetailId: saleDetailId },
      });
      await tx.technical_detail_for_sale_detail.create({
        data: {
          saleDetailId: saleDetailId,
          technicalDetails: body.technicalDetails,
        },
      });
    });
    return NextResponse.json({ message: "Success" });
  } catch (e) {
    console.log(e)
    return NextResponse.json({ message: "Something went wrong", error: e }, { status: 400 })
  }
}
