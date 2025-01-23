import {
  NextResponse
} from "next/server";

export function stackMiddlewares(middlewares = [], index = 0) {
  const current = middlewares[index];
  if (current) {
    const next = stackMiddlewares(middlewares, index + 1);
    return current(next);
  }
  return () => NextResponse.next();
}