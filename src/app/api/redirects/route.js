import { NextResponse } from 'next/server';
import fsPromises from 'fs/promises';
import path from 'path';
import redirects from '@/app/redirects/redirects.json'
import queryString from 'query-string';
import { db } from '@/app/db';

export async function GET(req) {
  let page = 1
  let size = 10

  try {
    const data = (await db.redirect.findFirst({})) || {}
    let redirectLists = Object.values(JSON.parse(data.redirect || "{}"))
    const { query } = queryString.parseUrl(req.url);

    if (query.source) {
      redirectLists = redirectLists.filter(item => item.source?.includes(query.source))
    }
    if (query.destination) {
      redirectLists = redirectLists.filter(item => item.destination?.includes(query.destination))
    }
    if (query.redirectType) {
      redirectLists = redirectLists.filter(item => item.redirectType === query.redirectType)
    }
    if (query.active) {
      redirectLists = redirectLists.filter(item => item.active === query.active === "true")
    }

    if (query) {
      page = parseInt(query.page) || 1
      size = parseInt(query.size) || 10
      redirectLists = redirectLists.splice((page - 1) * size, size)
    }

    return NextResponse.json({ redirects: redirectLists, total: Object.values(redirects).length })
  } catch (e) {
    console.log(e)
    return NextResponse.json({ message: "Something went wrong", error: e }, { status: 400 })
  }
}

export async function PUT(req) {
  try {
    const raw = await req.json()

    const updatedData = JSON.stringify(raw);
    await db.redirect.deleteMany({})
    await db.redirect.create({ data: { redirect: updatedData } })

    return NextResponse.json({ mesage: "Success" }, { status: 200 })
  } catch (e) {
    console.log(e)
    return NextResponse.json({ message: "Something went wrong", error: e }, { status: 400 })
  }
}