import { NextResponse } from 'next/server'

export async function DELETE(req, { params }) {

  if (!params.id) {
    return NextResponse.json({ message: "ID hình ảnh không hợp lệ" }, { status: 400 })
  }

  const wordpressRes = await fetch(`${process.env.WORDPRESS_URL}/wp-json/wp/v2/media/${params.id}&force=true`, {
    method: "DELETE",
    headers: {
      'Authorization': `Basic ${Buffer.from(`${process.env.WORDPRESS_ADMIN_USER}:${process.env.WORDPRESS_ADMIN_PASSWORD}`).toString('base64')}`
    },
  });

  if (wordpressRes.ok) {
    return NextResponse.json({ message: "Đã xóa hình ảnh" })
  }

  return NextResponse.json({ message: "Không thể xóa hình ảnh", response: await wordpressRes.json() }, { status: 400 })
}

export async function PUT(req, { params }) {

  if (!params.id) {
    return NextResponse.json({ message: "ID hình ảnh không hợp lệ" }, { status: 400 })
  }

  const body = await req.json()
  if (!body.title) {
    return NextResponse.json({ message: "Tên hình ảnh không hợp lệ" }, { status: 400 })
  }

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", `Basic ${Buffer.from(`${process.env.WORDPRESS_ADMIN_USER}:${process.env.WORDPRESS_ADMIN_PASSWORD}`).toString('base64')}`);

  const raw = JSON.stringify(body);

  const requestOptions = {
    method: "PUT",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
  };

  const wordpressRes = await fetch(`${process.env.WORDPRESS_URL}/wp-json/wp/v2/media/${params.id}`, requestOptions)

  if (wordpressRes.ok) {
    return NextResponse.json({ message: "Đã cập nhật hình ảnh" })
  }

  return NextResponse.json({ message: "Không thể cập nhật hình ảnh", response: await wordpressRes.json() }, { status: 400 })
}