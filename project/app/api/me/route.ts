import { NextResponse } from "next/server";
import { getUserFromToken } from "../../utils/auth";

export async function GET() {
  const user = await getUserFromToken();
  return NextResponse.json({ user });
}