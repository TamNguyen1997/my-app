import { db } from '@/app/db';
import { NextResponse } from 'next/server';
import fsPromises from 'fs/promises';
import path from 'path';
import redirects from '@/app/redirects/redirects.json'

export async function GET(req) {

  try {
    return NextResponse.json(redirects)
  } catch (e) {
    console.log(e)
    return NextResponse.json({ message: "Something went wrong", error: e }, { status: 400 })
  }
}

export async function POST(req) {
  try {
    const raw = await req.json()

    return NextResponse.json(
      await db.redirect.create({
        data: raw
      })
      , { status: 200 })
  } catch (e) {
    console.log(e)
    return NextResponse.json({ message: "Something went wrong", error: e }, { status: 400 })
  }
}

export async function PUT(req) {
  try {
    const dataFilePath = path.join(process.cwd(), 'src/app/redirects/redirects.json');

    const raw = await req.json()

    const updatedData = JSON.stringify(raw);
    await fsPromises.writeFile(dataFilePath, updatedData);

    return NextResponse.json({ mesage: "Success" }, { status: 200 })
  } catch (e) {
    console.log(e)
    return NextResponse.json({ message: "Something went wrong", error: e }, { status: 400 })
  }
}