import { db } from '@/app/db';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  let id = params.id

  return NextResponse.json(await db.user.findUnique({
    where: {
      id: id
    }
  }))
}

export async function DELETE(req, { params }) {
  let id = params.id

  return NextResponse.json(await db.user.delete({
    where: {
      id: id
    }
  }))
}
