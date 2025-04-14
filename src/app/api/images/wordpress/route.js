import { NextResponse } from 'next/server'
import queryString from 'query-string';

export async function GET(req) {
  const { query } = queryString.parseUrl(req.url);

  let page = 1
  let size = 10

  if (query) {
    page = parseInt(query.page) || 1
    size = parseInt(query.size) || 10
  }

  const wordpressRes = await fetch(`${process.env.WORDPRESS_URL}/wp-json/wp/v2/media/?search=${query.search}&per_page=${size}&page=${page}`);

  const total = parseInt(wordpressRes.headers.get("X-WP-TotalPages") || "0")
  if (wordpressRes.ok) {
    return NextResponse.json({
      result: await wordpressRes.json(),
      total
    })
  }

  return NextResponse.json([])
}