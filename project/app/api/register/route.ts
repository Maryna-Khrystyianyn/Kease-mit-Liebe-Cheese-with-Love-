import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import OpenAI from "openai";
import bcrypt from "bcrypt";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Функція перекладу через OpenAI
async function translate(text: string, target: "uk" | "de") {
  if (!text || text.trim() === "") return text;
  console.log("Wir sind in TRANSLATE.... text", text, "language - ", target);
  const prompt = `
  Translate the following text into ${target === "uk" ? "Ukrainian" : "German"}.
  Return ONLY the translation, no explanations.
  
  Text:
  "${text}"
  `;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
  });
  console.log("Translate - ", completion.choices[0]);
  const msg = completion.choices[0].message?.content;
  if (!msg) {
    return ""; // або null, або текст помилки
  }
  return msg.trim();
}


export async function POST(req: Request) {
  console.log("wir sind in POST");
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
      locale, // "de" або "uk"
    } = body;

    if (!password) {
      return NextResponse.json(
        { message: "Password is required" },
        { status: 400 }
      );
    }
    // Хешуємо пароль
    const hashedPassword = await bcrypt.hash(password, 10);

    // Визначаємо напрям перекладу
    const targetLang = locale === "de" ? "uk" : "de";

    // Автоматичний переклад

    const translatedMood = mood ? await translate(mood, targetLang) : "";
    const translatedInfo = info ? await translate(info, targetLang) : "";
    const translatedAddress = user_address
      ? await translate(user_address, targetLang)
      : "";

    // Формуємо JSON об'єкти з двома мовами
    const moodJson =
      locale === "de"
        ? { de: mood || "", uk: translatedMood }
        : { uk: mood || "", de: translatedMood };

    const infoJson =
      locale === "de"
        ? { de: info || "", uk: translatedInfo }
        : { uk: info || "", de: translatedInfo };

    const addressJson =
      locale === "de"
        ? { de: user_address || "", uk: translatedAddress }
        : { uk: user_address || "", de: translatedAddress };

    // Створюємо користувача
    const newUser = await prisma.users.create({
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
        mood: moodJson,
        info: infoJson,
        user_address: addressJson,
      },
    });

    return NextResponse.json(
      { message: "User created successfully!", user: newUser },
      { status: 200 }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("REGISTER ERROR:", error.message);
      return NextResponse.json(
        { message: "Error creating user", error: error.message },
        { status: 500 }
      );
    } else {
      console.error("REGISTER ERROR:", error);
      return NextResponse.json(
        { message: "Error creating user", error: String(error) },
        { status: 500 }
      );
    }
  }
}
