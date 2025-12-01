import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { nickname: string } }
) {
  const { nickname } = await params;

  if (!nickname) {
    return NextResponse.json({ message: "Nickname is required" }, { status: 400 });
  }

  try {
    const user = await prisma.users.findUnique({
      where: { nick_name: nickname },
      select: {
        nick_name: true,
        username: true,
        email: true,
        telefon: true,
        user_status: true,
        avatar: true,
        ispublic: true,
        issubscribed: true,
      },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (err) {
    console.error("Error fetching user:", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}