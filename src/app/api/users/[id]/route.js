import { db } from "@/app/db";
import { NextResponse } from "next/server";
import CryptoJS from "crypto-js";
import { USER_MESSAGE } from "@/constants/message";

const PRIVATE_KEY = process.env.PRIVATE_KEY || "private_key";

export async function GET(req, { params }) {
  const { id } = params;

  try {
    const user = await db.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        active: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: USER_MESSAGE.USER_NOT_FOUND },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (e) {
    return NextResponse.json(
      { message: USER_MESSAGE.USER_NOT_FOUND, error: e },
      { status: 400 }
    );
  }
}

export async function PUT(req, { params }) {
  const { id } = params;

  try {
    const body = await req.json();

    const { password, newPassword, email } = body;

    if (email) {
      const existingUser = await db.user.findUnique({
        where: { email },
      });

      if (existingUser && existingUser.id !== id) {
        return NextResponse.json(
          { message: USER_MESSAGE.EMAIL_ALREADY_EXISTS },
          { status: 400 }
        );
      }
    }

    if (password && newPassword) {
      const hashedPassword = CryptoJS.HmacSHA256(
        password,
        PRIVATE_KEY
      ).toString();

      const user = await db.user.findUnique({
        where: { id },
      });

      if (!user || user.password !== hashedPassword) {
        return NextResponse.json(
          { message: USER_MESSAGE.INCORRECT_PASSWORD },
          { status: 400 }
        );
      }

      body.password = CryptoJS.HmacSHA256(newPassword, PRIVATE_KEY).toString();
    }

    delete body.newPassword;

    const updatedUser = await db.user.update({
      where: { id },
      data: body,
    });

    return NextResponse.json(
      { data: updatedUser, message: USER_MESSAGE.UPDATE_SUCCESS },
      { status: 200 }
    );
  } catch (e) {
    return NextResponse.json(
      { message: USER_MESSAGE.UPDATE_FAILED, error: e },
      { status: 400 }
    );
  }
}

export async function DELETE(req, { params }) {
  let id = params.id;

  try {
    await db.user.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: USER_MESSAGE.DELETE_SUCCESS },
      { status: 200 }
    );
  } catch (e) {
    return NextResponse.json(
      { message: USER_MESSAGE.DELETE_FAILED, error: e },
      { status: 400 }
    );
  }
}
