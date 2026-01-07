import { NextRequest, NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";
import { requireUser } from "../../../utils/auth";

export async function PUT(req: NextRequest) {
  try {
    // 🔐 беремо користувача з JWT
    const user = await requireUser();

    const body = await req.json();

    const {
      username,
      telefon,
      mood,
      info,
      user_address,
      ispublic,
      issubscribed,
    } = body;

    const updatedUser = await prisma.users.update({
      where: {
        nick_name: user.nick_name, 
      },
      data: {
        username,
        telefon,
        mood,
        info,
        user_address,
        ispublic,
        issubscribed,
      },
      select: {
        nick_name: true,
        username: true,
        email: true,
        avatar: true,
        user_status: true,
        mood: true,
        info: true,
        telefon: true,
        user_address: true,
        ispublic: true,
        issubscribed: true,
      },
    });

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error("PROFILE UPDATE ERROR:", error);

    return NextResponse.json(
      { error: "Nicht autorisiert oder ungültige Daten" },
      { status: 401 }
    );
  }
}
