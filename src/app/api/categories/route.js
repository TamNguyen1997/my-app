import { NextResponse } from 'next/server';

export const categories = [
  {
    id: "rubbermaid",
    name: "Rubbermaid"
  },
  {
    id: "ghibli",
    name: "Ghible"
  },
  {
    id: "mapa",
    name: "Mapa"
  },
  {
    id: "moerman",
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
