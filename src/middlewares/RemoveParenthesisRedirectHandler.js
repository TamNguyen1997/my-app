import {
  NextResponse
} from "next/server";

export const RemoveParenthesisRedirectHandler = (next) => {
  return async (request, _next) => {
    const pathname = request.nextUrl.pathname;
    if ((pathname?.includes("(") || pathname?.includes(")"))
      && !pathname.includes("/api/")
      && !pathname.includes(".svg")
      && !pathname.includes(".png")
      && !pathname.includes(".ico")
      && !pathname.includes(".jpeg")
      && !pathname.includes(".webp")
      && !pathname.includes(".avif")
      && !pathname.includes(".jpg")
      && !pathname.includes(".json")
      && !pathname.includes("/_next/")) {
      const url = request.nextUrl.clone();
      url.pathname = pathname.replaceAll("(", "").replaceAll(")", "");

      return NextResponse.redirect(url, 301);
    }

    return next(request, _next);
  };
};