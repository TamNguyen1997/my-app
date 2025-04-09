import { NextResponse } from "next/server";

export const AdminAuthentication = (next) => {
  return async (request, _next) => {
    const pathname = request.nextUrl.pathname;

    if (pathname.startsWith("/admin")) {
      const userCookie = request.cookies.get("user");

      const role = request.cookies.get("role");
      if (!userCookie || !role || role.value === "undefined") {
        const url = request.nextUrl.clone();
        url.pathname = "/login";
        return NextResponse.redirect(url);
      }

      const [userId, username] = userCookie.value.split(":");

      if (!userId || !username) {
        return NextResponse.redirect("/login");
      }
    }

    return next(request, _next);
  };
};
