import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const email = searchParams.get("email");
  const page = Number(searchParams.get("page") || 1);
  const perPage = Number(searchParams.get("perPage") || 50);
  const sortOrder = searchParams.get("sort") === "old" ? "asc" : "desc";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {
    status: { in: ["delivered", "cancelled", "refunded"] },
  };
  if (status && status !== "all") where.status = status;
  if (email) where.email = { contains: email, mode: "insensitive" };

  // Обов'язково робимо count для всіх сторінок
  const total = await prisma.orders.count({ where });

  // Беремо лише сторінку
  const orders = await prisma.orders.findMany({
    where,
    orderBy: { date: sortOrder },
    skip: (page - 1) * perPage,
    take: perPage,
  });

  return NextResponse.json({ orders, total, page, perPage });
}