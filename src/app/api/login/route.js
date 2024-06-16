import { db } from '@/app/db';
import { NextResponse } from 'next/server';
import CryptoJS from 'crypto-js';

const PRIVATE_KEY = process.env.PRIVATE_KEY || "private_key"

export async function POST(req) {
  try {
    const body = await req.json()
    const user = await db.user.findUnique({ where: { username: body.username } })
    if (!user) {
      return NextResponse.json({ message: "User not found", error: e }, { status: 404 })
    }
    if (user.password !== CryptoJS.HmacSHA256(body.password, PRIVATE_KEY).toString()) {
      return NextResponse.json({ message: "Invalid password", error: e }, { status: 401 })
    }
    return NextResponse.json(user)
  } catch (e) {
    return NextResponse.json({ message: "Something went wrong", error: e }, { status: 400 })
  }
}
