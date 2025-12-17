import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ message: "Logged out" });

  // Витираємо cookie токен
  response.cookies.set({
    name: "token",
    value: "",
    maxAge: 0, // одразу видаляємо
    path: "/",  // важливо, щоб cookie була правильною
  });

  return response;
}
