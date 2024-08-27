import { db } from '@/app/db';
import { NextResponse } from 'next/server';

export async function OPTIONS(request) {
  try {
    const url = new URL(request.url);
    const from = url.searchParams.get('from');

    if (!from) {
      return NextResponse.json({ message: "No redirect" })
    }

    const redirect = await db.redirect.findFirst({
      where: {
        from: {
          search: `${from.trim().replaceAll(" ", " & ")}:*`
        }
      }
    })
    if ((redirect && redirect.from === from) || (redirect && request.url.startsWith(redirect.from) && redirect.redirectType === "REGEX")) {
      const temp = new NextResponse(null, {
        status: redirect.redirectCode,
        headers: {
          'X-Custom-Header': redirect.to
        },
      })
      return temp
    }

    return NextResponse.json({ message: "No redirect" })
  } catch (e) {
    console.log(e)
    return NextResponse.json({ message: "Something went wrong", error: e }, { status: 400 })
  }
}
