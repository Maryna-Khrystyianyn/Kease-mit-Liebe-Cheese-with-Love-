import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { generateToken } from "../../utils/generateToken"
import { users } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { message: "E-Mail und Passwort sind erforderlich" },
        { status: 400 }
      );
    }

   
    const user:users|null = await prisma.users.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json(
        { message: "Benutzer nicht gefunden" },
        { status: 404 }
      );
    }

    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Falsches Passwort" },
        { status: 401 }
      );
    }

 
    const token = generateToken(user);

   
    const response = NextResponse.json(
      { message: "Login erfolgreich!",token, user: { email: user.email, username: user.username } },
      { status: 200 }
    );
    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 днів
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
    

    return response;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("LOGIN ERROR:", error.message);
      return NextResponse.json(
        { message: "Fehler beim Login", error: error.message },
        { status: 500 }
      );
    } else {
      console.error("LOGIN ERROR:", error);
      return NextResponse.json(
        { message: "Fehler beim Login", error: String(error) },
        { status: 500 }
      );
    }
  }
}