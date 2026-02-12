import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { generateToken } from "../../utils/generateToken";
import { users } from "@prisma/client";

export async function POST(req: Request) {
  const contentType = req.headers.get("content-type") || "";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let body: any;

  try {
    // --- Обробка даних ---
    if (contentType.includes("multipart/form-data")) {
      // Мобільний: FormData -> Object
      const formData = await req.formData();
      body = Object.fromEntries(formData.entries());
    } else {
      // Веб: JSON
      body = await req.json();
    }

    // --- Перетворюємо булеві значення ---
    const ispublic = body.ispublic === "true" || body.ispublic === true;
    const issubscribed = body.issubscribed === "true" || body.issubscribed === true;

    // --- Деструктуризація ---
    const {
      nick_name = "",
      username = "",
      email,
      password,
      telefon = "",
      avatar = "",
      user_status = "user",
      mood = "",
      info = "",
      user_address = "",
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

    // --- Хешуємо пароль ---
    const hashedPassword = await bcrypt.hash(password, 10);

    // --- Створюємо користувача ---
    const newUser: users = await prisma.users.create({
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

    // --- Генеруємо токен ---
    const token = generateToken(newUser);

    // --- Відповідь ---
    const response = NextResponse.json(
      {
        message: "Benutzer erfolgreich erstellt!",
        token,
        user: { email: newUser.email, username: newUser.username, avatar: newUser.avatar },
      },
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
    const message = error instanceof Error ? error.message : String(error);
    console.error("REGISTER ERROR:", message);
    return NextResponse.json(
      { message: "Fehler bei der Registrierung", error: message },
      { status: 500 }
    );
  }
}
