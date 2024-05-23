import { NextResponse } from 'next/server';

export const categories = [
  {
    id: "Rubbermaid",
    name: "Rubbermaid"
  },
  {
    id: "Ghibli",
    name: "Ghibli"
  },
  {
    id: "Mapa",
    name: "Mapa"
  },
  {
    id: "Moerman",
    name: "Moerman"
  }
]

export async function GET(req) {
  try {
    return NextResponse.json(categories)
  } catch (e) {
    console.log(e)
    return NextResponse.json({ message: "Something went wrong", error: e }, { status: 400 })
  }
}
