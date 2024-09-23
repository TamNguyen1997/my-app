import { db } from '@/app/db';
import { NextResponse } from 'next/server';
import queryString from 'query-string';
import fsPromises from 'fs/promises';
import path from 'path';

export async function GET(req) {
  let page = 1
  let size = 10
  const { query } = queryString.parseUrl(req.url);
  let condition = {}

  try {
    if (query) {
      page = parseInt(query.page) || 1
      size = parseInt(query.size) || 10
    }

    if (query.from) {
      condition.from = {
        search: `${query.from.trim().replaceAll(" ", " & ")}:*`
      }
    }

    if (query.to) {
      condition.to = {
        search: `${query.to.trim().replaceAll(" ", " & ")}:*`
      }
    }

    if (query.redirectType) {
      condition.redirectType = query.redirectType
    }

    const result = await db.redirect.findMany({
      where: condition,
      take: size,
      skip: (page - 1) * size
    })
    return NextResponse.json({
      result,
      total: await db.redirect.count({
        where: condition
      })
    })

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
    const jsonData = await fsPromises.readFile(dataFilePath)
    const objectData = JSON.parse(jsonData);

    const raw = await req.json()

    objectData[raw['url']] = {
      "destination": raw['destination'],
      "permanent": raw['permanent']
    }
    const updatedData = JSON.stringify(objectData);
    await fsPromises.writeFile(dataFilePath, updatedData);

    return NextResponse.json({ mesage: "Success" }, { status: 200 })
  } catch (e) {
    console.log(e)
    return NextResponse.json({ message: "Something went wrong", error: e }, { status: 400 })
  }
}