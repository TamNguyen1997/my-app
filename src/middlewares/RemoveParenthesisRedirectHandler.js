import {
  NextResponse
} from "next/server";

export const RemoveParenthesisRedirectHandler = (next) => {
  return async (request, _next) => {
    const pathname = request.nextUrl.pathname;
    if (request.nextUrl.pathName.includes("(") || request.nextUrl.pathName.includes(")")) {
      const url = request.nextUrl.clone();
      url.pathname = pathname.replaceAll("(", "").replaceAll(")", "");

      return NextResponse.redirect(url, 301);
    }

    return next(request, _next);
  };
};