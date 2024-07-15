import { NextResponse } from 'next/server';
import { db } from '@/app/db';
import queryString from 'query-string';

export async function GET(req) {
  let condition = {}
  let include = { image: true }
  const { query } = queryString.parseUrl(req.url);

	if (query.searchText) {
		condition.name = {
			contains: `${query.searchText}`,
			mode: 'insensitive'
		}
	}

  try {
    const result = await db.category.findMany({
      where: condition,
      orderBy: [
        {
          updatedAt: "desc"
        }
      ],
      include: include
    })

    return NextResponse.json({ result, total: await db.category.count({ where: condition }) })
  } catch (e) {
    console.log(e)
    return NextResponse.json({ message: "Something went wrong", error: e }, { status: 400 })
  }
}