import { NextResponse } from 'next/server'

export async function POST(req) {
  const formData = await req.formData();

  try {
    const wordpressResponse = await fetch(`${process.env.WORDPRESS_URL}/wp-json/wp/v2/media`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${process.env.WORDPRESS_ADMIN_USER}:${process.env.WORDPRESS_ADMIN_PASSWORD}`).toString('base64')}`
      },
      body: formData
    })
    const wordpressResponseData = await wordpressResponse.json();
    if (!wordpressResponse.ok) {
      return NextResponse.json({ message: "Something went wrong", wordpressResponseData }, { status: 400 });
    }

    return NextResponse.json({ message: "Image uploaded successfully" });
  } catch (e) {
    return NextResponse.json({ message: "Something went wrong", error: e }, { status: 400 });
  }
}
