import { NextResponse, NextRequest } from "next/server";

type RedirectEntry = {
  source: string,
  redirectType: string,
  destination: string;
  permanent: boolean;
};

export async function middleware(request: NextRequest) {
  try {
    const pathname = request.nextUrl.pathname;

    if (!pathname) {
      return NextResponse.next();
    }
    // ---------------------------------------------------
    if (pathname.startsWith("/admin")) {
      const userCookie = request.cookies.get("user");

      if (!userCookie) {
        const url = request.nextUrl.clone();
        url.pathname = "/login";
        return NextResponse.redirect(url);
      }

      const [userId, username] = userCookie.value.split(":");

      if (!userId || !username) {
        return NextResponse.redirect("/login");
      }
    }

    if (pathname === "/login") {
      const userCookie = request.cookies.get("user");

      if (userCookie) {
        const url = request.nextUrl.clone();
        url.pathname = "/";
        return NextResponse.redirect(url);
      }
    }
    // ---------------------------------------------------

    if (!pathname.includes("/api/")
      && !pathname.includes("/_next/static/")
      && !pathname.toLocaleLowerCase().endsWith(".svg")
      && !pathname.toLocaleLowerCase().endsWith(".png")
      && !pathname.toLocaleLowerCase().endsWith(".ico")
      && !pathname.includes("/admin/")) {
      console.log("??????????????")
      console.log(pathname)
      const apiResponse = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/redirects?active=true&size=10000&page=1`);
      const { redirects } = await apiResponse.json();
      console.log(redirects)
      if (redirects && redirects.length) {
        const match = redirects.find((r: RedirectEntry) =>
          (r.redirectType === "REGEX" && r.source.includes(pathname)) ||
          (r.redirectType === "EXACT" && r.source === pathname))
        console.log("!!!!!!!!!!!!!!!!!")
        console.log(match)
        if (match) {
          const statusCode = match.permanent ? 301 : 302;
          const url = request.nextUrl.clone();
          url.pathname = match.destination;
          return NextResponse.redirect(url, statusCode);
        }
      }
    }

    // ---------------------------------------------------
    const method = request.method;
    if (
      ["POST", "PUT", "DELETE"].includes(method) &&
      pathname.startsWith("/api")
    ) {
      if (pathname !== "/api/order" && pathname !== "/api/login") {
        const userCookie = request.cookies.get("user");

        if (!userCookie) {
          return NextResponse.json(
            { message: "Unauthorized: Please log in." },
            { status: 401 }
          );
        }

        const [userId, username] = userCookie.value.split(":");

        if (!userId || !username) {
          return NextResponse.json(
            { message: "Unauthorized: Invalid session." },
            { status: 401 }
          );
        }
      }
    }

    return NextResponse.next();
  } catch (error) {
    console.error(error);
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/:path*",
};
