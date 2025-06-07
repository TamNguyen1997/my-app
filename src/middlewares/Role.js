import { NextResponse } from "next/server";
import { user_role } from "@prisma/client";

export const Role = (next) => {
  return async (request, _next) => {
    const pathname = request.nextUrl.pathname;
    if (pathname.includes("/api/")) {
      const userCookie = request.cookies.get("user");
      if (userCookie) {
        const role = request.cookies.get("role");
        if (role) {
          const method = request.method;
          if (method === "DELETE" && role.value === user_role.MANAGER) {
            return NextResponse.json(
              { message: "Bạn không có quyền xoá tài nguyên này!" },
              { status: 403 }
            );
          }
        }
      }
    }

    return next(request, _next);
  };
};
