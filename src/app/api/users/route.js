import { db } from "@/app/db";
import { NextResponse } from "next/server";
import queryString from "query-string";
import CryptoJS from "crypto-js";
import { USER_MESSAGE } from "@/constants/message";

const PRIVATE_KEY = process.env.PRIVATE_KEY || "private_key";

export async function GET(req) {
  const url = new URL(req.url);
  const searchParams = url.searchParams;

  let page = Math.max(1, +searchParams.get("page"));
  let limit = Math.max(1, +searchParams.get("limit") || 10);

  const totalUsers = await db.user.count();

  const totalPages = Math.ceil(totalUsers / limit);

  const skip = Math.max((page - 1) * limit, 0);

  try {
    const result = await db.user.findMany({
      orderBy: [
        {
          updatedAt: "desc",
        },
      ],
      take: limit,
      skip,
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        active: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(
      {
        data: result,
        currentPage: page,
        totalPages,
        totalUsers,
        message: USER_MESSAGE.USERS_FETCH_SUCCESS,
      },
      { status: 200 }
    );
  } catch (e) {
    return NextResponse.json(
      { message: USER_MESSAGE.USERS_FETCH_FAILED, error: e },
      { status: 400 }
    );
  }
}

export async function POST(req) {
  try {
    const body = await req.json();

    const { username, password, email, name } = body;

    if (!username || !password || !email || !name) {
      return NextResponse.json(
        { message: USER_MESSAGE.INVALID_USER_DATA },
        { status: 400 }
      );
    }

    const existingUsername = await db.user.findUnique({
      where: { username },
    });

    if (existingUsername) {
      return NextResponse.json(
        { message: USER_MESSAGE.USERNAME_ALREADY_EXISTS },
        { status: 400 }
      );
    }

    const existingEmail = await db.user.findUnique({
      where: { email },
    });

    if (existingEmail) {
      return NextResponse.json(
        { message: USER_MESSAGE.EMAIL_ALREADY_EXISTS },
        { status: 400 }
      );
    }

    body.password = CryptoJS.HmacSHA256(body.password, PRIVATE_KEY).toString();

    const result = await db.user.create({
      data: body,
    });

    return NextResponse.json(
      {
        message: USER_MESSAGE.CREATE_SUCCESS,
        insertedId: result.id,
      },
      { status: 201 }
    );
  } catch (e) {
    return NextResponse.json(
      { message: USER_MESSAGE.CREATE_FAILED, error: e },
      { status: 400 }
    );
  }
}
