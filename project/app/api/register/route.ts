import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { generateToken } from "../../utils/generateToken"
import { users } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      nick_name,
      username,
      email,
      password,
      telefon,
      avatar,
      user_status = "user",
      ispublic = true,
      issubscribed = true,
      mood,
      info,
      user_address,
    } = body;

    if (!email || !password) {
      return NextResponse.json(
        { message: "E-Mail und Passwort sind erforderlich" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.users.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { message: "Benutzer mit dieser E-Mail existiert bereits" },
        { status: 400 }
      );
    }

 
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser:users = await prisma.users.create({
      data: {
        nick_name,
        username,
        email,
        password: hashedPassword,
        telefon,
        avatar,
        user_status,
        ispublic,
        issubscribed,
        mood,
        info,
        user_address,
      },
    });

  
    const token = generateToken(newUser);

  
    const response = NextResponse.json(
      { message: "Benutzer erfolgreich erstellt!", user: { email: newUser.email, username: newUser.username , avatar:newUser.avatar } },
      { status: 200 }
    );
    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7, 
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    return response;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("REGISTER ERROR:", error.message);
      return NextResponse.json(
        { message: "Fehler bei der Registrierung", error: error.message },
        { status: 500 }
      );
    } else {
      console.error("REGISTER ERROR:", error);
      return NextResponse.json(
        { message: "Fehler bei der Registrierung", error: String(error) },
        { status: 500 }
      );
    }
  }
}