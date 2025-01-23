import {
  NextResponse
} from "next/server";

export const AdminAuthorization = (next) => {
  return async (request, _next) => {
    const method = request.method;
    const pathname = request.nextUrl.pathname;
    if (
      ["POST", "PUT", "DELETE"].includes(method) &&
      pathname.startsWith("/api") &&
      !pathname.startsWith("/api/courier/shipping-price")
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

    return next(request, _next);
  };
};