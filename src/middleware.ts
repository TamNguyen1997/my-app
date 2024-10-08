import { NextResponse, NextRequest } from "next/server";
import redirects from "@/app/redirects/redirects.json";

type RedirectEntry = {
  destination: string;
  permanent: boolean;
};

export function middleware(request: NextRequest) {
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

    const redirect = (redirects as Record<string, RedirectEntry>)[pathname];
    if (redirect) {
      const statusCode = redirect.permanent ? 308 : 307;
      const url = request.nextUrl.clone();
      url.pathname = redirect.destination;
      return NextResponse.redirect(url, statusCode);
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
