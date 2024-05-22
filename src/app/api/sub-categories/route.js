import { db } from '@/app/db';
import { NextResponse } from 'next/server';

export async function GET(req) {
  return NextResponse.json({ message: "Something went wrong", error: e }, { status: 400 })
}
