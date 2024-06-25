import { NextResponse } from 'next/server'
import { db } from '@/app/db';

export async function GET(req) {
  return NextResponse.json(await db.image.findMany())
}
