import { db } from "@/app/db";
import { NextResponse } from "next/server";
import CryptoJS from "crypto-js";
import { USER_MESSAGE, LOGIN_MESSAGE } from "@/constants/message";

const PRIVATE_KEY = process.env.PRIVATE_KEY || "private_key";

export async function POST(req) {
  try {
    const body = await req.json();

    const user = await db.user.findUnique({
      where: { username: body.username },
    });

    if (!user) {
      return NextResponse.json(
        { message: USER_MESSAGE.USER_NOT_FOUND },
        { status: 404 }
      );
    }

    if (!user.active) {
      return NextResponse.json(
        { message: USER_MESSAGE.USER_NOT_ACTIVE },
        { status: 403 }
      );
    }

    if (
      user.password !==
      CryptoJS.HmacSHA256(body.password, PRIVATE_KEY).toString()
    ) {
      return NextResponse.json(
        { message: USER_MESSAGE.INCORRECT_PASSWORD },
        { status: 401 }
      );
    }

    const response = NextResponse.json(
      { message: LOGIN_MESSAGE.LOGIN_SUCCESS },
      { status: 200 }
    );

    response.cookies.set("user", `${user.id}:${user.username}`, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    return response;
  } catch (e) {
    return NextResponse.json(
      { message: LOGIN_MESSAGE.LOGIN_FAILED, error: e },
      { status: 400 }
    );
  }
}
