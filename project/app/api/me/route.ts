import { NextResponse } from "next/server";
import { getUserFromToken } from "../../utils/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const userTokenData = await getUserFromToken();
  if (!userTokenData) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  const user = await prisma.users.findUnique({
    where: { nick_name: userTokenData.nick_name },
  });

  return NextResponse.json({ user });
}