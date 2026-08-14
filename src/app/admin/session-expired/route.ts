import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE } from "@/lib/auth-constants";

// Landing spot for sessions that pass the edge signature check but fail the
// database password-tag check (e.g. after a password change). Clears the dead
// cookie so the proxy stops treating the visitor as signed in.
export async function GET(request: Request) {
  const response = NextResponse.redirect(new URL("/admin/login", request.url));
  response.cookies.delete(ADMIN_SESSION_COOKIE);
  return response;
}
