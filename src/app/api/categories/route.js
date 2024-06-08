import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    return NextResponse.json( [
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
    ])
  } catch (e) {
    return NextResponse.json({ message: "Something went wrong", error: e }, { status: 400 })
  }
}
