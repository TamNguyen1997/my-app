import { cookies } from "next/headers";
import { LOGIN_MESSAGE } from "@/constants/message";
import { NextResponse } from "next/server";

export async function GET(req) {
  const cookieStore = cookies();
  const userCookie = cookieStore.get("user");

  if (!userCookie) {
    return NextResponse.json(
      { message: LOGIN_MESSAGE.USER_NOT_LOGGED_IN },
      { status: 400 }
    );
  }

  const response = NextResponse.json(
    { message: LOGIN_MESSAGE.LOGOUT_SUCCESS },
    { status: 200 }
  );

  response.cookies.set("user", "", {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });

  return response;
}
