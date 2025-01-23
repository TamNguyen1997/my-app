import {
  NextResponse
} from "next/server";

export const RedirectHandler = (next) => {
  return async (request, _next) => {
    const pathname = request.nextUrl.pathname;

    if (!pathname.includes("/api/")
      && !pathname.includes("/_next/static/")
      && !pathname.toLocaleLowerCase().endsWith(".svg")
      && !pathname.toLocaleLowerCase().endsWith(".png")
      && !pathname.toLocaleLowerCase().endsWith(".ico")
      && !pathname.toLocaleLowerCase().endsWith(".jpeg")
      && !pathname.toLocaleLowerCase().endsWith(".webp")
      && !pathname.toLocaleLowerCase().endsWith(".avif")
      && !pathname.toLocaleLowerCase().endsWith(".jpg")
      && !pathname.toLocaleLowerCase().endsWith(".json")
      && !pathname.includes("/admin/")) {

      const apiResponse = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/redirects?active=true&size=10000&page=1`);
      const { redirects } = await apiResponse.json();
      if (redirects && redirects.length) {
        const match = redirects.find((r) =>
          (r.redirectType === "REGEX" && r.source.includes(pathname)) ||
          (r.redirectType === "EXACT" && r.source === pathname))
        if (match) {
          const statusCode = match.permanent ? 301 : 302;
          const url = request.nextUrl.clone();
          url.pathname = match.destination;
          return NextResponse.redirect(url, statusCode);
        }
      }
    }


    return next(request, _next);
  };
};