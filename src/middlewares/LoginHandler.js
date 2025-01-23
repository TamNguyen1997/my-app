import {
  NextResponse
} from "next/server";

export const LoginHandler = (next) => {
  return async (request, _next) => {
    const pathname = request.nextUrl.pathname;

    if (pathname === "/login") {
      const userCookie = request.cookies.get("user");

      if (userCookie) {
        const url = request.nextUrl.clone();
        url.pathname = "/";
        return NextResponse.redirect(url);
      }
    }

    return next(request, _next);
  };
};