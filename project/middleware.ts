import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(JWT_SECRET)
    );

    if (payload.user_status !== "admin") {
      return NextResponse.redirect(new URL("/forbidden", req.url));
    }

    return NextResponse.next();
  } catch (err) {
    console.error("JWT verify failed:", err);
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: [
    "/recipe/add/:path*",
    "/recipe/edit/:path*",
    "/recipe/delete/:path*", //Ich plane nicht, eine separate Seite für Löschvorgänge zu erstellen, aber ich lasse sie vorsichtshalber da.
    "/admin/:path*",
    "/shop/products/:id/edit/:path*",
    "/shop/products/add/:path*",
  ],
};
