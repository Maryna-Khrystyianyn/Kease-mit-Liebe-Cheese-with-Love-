import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const email = searchParams.get("email");
  const page = Number(searchParams.get("page") || 1);
  const perPage = Number(searchParams.get("perPage") || 50);
  const filterAll = searchParams.get("filterAll") === "true"; // true = отримуємо всі під фільтри
  const sort = searchParams.get("sort") === "old" ? "asc" : "desc";

  const where: any = {
    status: { in: ["delivered", "cancelled", "refunded"] },
  };

  if (status && status !== "all") where.status = status;
  if (email) where.email = { contains: email, mode: "insensitive" };

  let orders, total;

  if (filterAll) {
    orders = await prisma.orders.findMany({
      where,
      orderBy: { date: sort },
    });
    total = orders.length;
  } else {
    total = await prisma.orders.count({ where });
    orders = await prisma.orders.findMany({
      where,
      orderBy: { date: sort },
      skip: (page - 1) * perPage,
      take: perPage,
    });
  }

  return NextResponse.json({ orders, total, page, perPage });
}