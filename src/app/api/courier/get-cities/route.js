import { NextResponse } from "next/server";

export async function GET() {
  const res = await fetch("https://partner.viettelpost.vn/v2/categories/listProvince");
  return NextResponse.json(await res.json())
}