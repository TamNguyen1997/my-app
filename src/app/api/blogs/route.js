import { db } from '@/app/db';
import { NextResponse } from 'next/server';
import queryString from 'query-string';
import crypto from "crypto";

export async function POST(req) {
  try {
    const body = await req.json()
    const blogId = crypto.randomBytes(3).toString("hex")
    if (body.id) return NextResponse.json(await db.blog.update({ where: { id: body.id }, data: body }))

    return NextResponse.json(await db.blog.create({
      data: {
        ...body,
        blogId: blogId,
        slug: `${body.slug}-${blogId}`
      }
    }))
  } catch (e) {
    return NextResponse.json({ message: "Something went wrong", error: e }, { status: 400 })
  }
}

export async function GET(req) {
  try {
    const { query } = queryString.parseUrl(req.url);

    let page = query.page ? parseInt(query.page) : 1
    let size = query.size ? parseInt(query.size) : 10

    const res = await fetch(`${process.env.WORDPRESS_URL}/wp-json/wp/v2/posts/?_embed&search=${query.searchTerm}&per_page=${size}&page=${page}&categories=${[process.env.NEXT_PUBLIC_WORDPRESS_POST_NEWS_ID, process.env.NEXT_PUBLIC_WORDPRESS_POST_INFORMATION_ID].join(",")}`)
    const totalBlog = res.headers.get('X-WP-Total')

    const result = await res.json()

    return NextResponse.json({
      result,
      total: totalBlog
    })
  } catch (e) {
    console.log(e)
    return NextResponse.json({ message: "Something went wrong", error: e }, { status: 400 })
  }
}