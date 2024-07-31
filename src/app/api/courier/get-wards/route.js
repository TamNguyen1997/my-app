import { NextResponse } from "next/server";
import queryString from "query-string";

export async function GET(req) {
  const { query } = queryString.parseUrl(req.url);
  const res = await fetch(`https://partner.viettelpost.vn/v2/categories/listWards?districtId=${query.districtId}`);
  return NextResponse.json(await res.json())
}