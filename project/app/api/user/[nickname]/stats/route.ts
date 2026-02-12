import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ nickname: string }> }
) {
  const { nickname } = await params;

  if (!nickname) {
    return NextResponse.json({ message: "Nickname is required" }, { status: 400 });
  }

  try {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Get all batches for this user
    const batches = await prisma.cheese_batches.findMany({
      where: { user_nick: nickname },
      select: {
        cheeseweight: true,
        date_batch: true,
      },
    });

    let totalWeight = 0;
    let yearWeight = 0;
    let monthWeight = 0;

    batches.forEach((batch) => {
      const weight = Number(batch.cheeseweight || 0);
      const date = batch.date_batch ? new Date(batch.date_batch) : null;

      totalWeight += weight;

      if (date) {
        if (date >= startOfYear) {
          yearWeight += weight;
        }
        if (date >= startOfMonth) {
          monthWeight += weight;
        }
      }
    });

    return NextResponse.json({
      total: totalWeight,
      year: yearWeight,
      month: monthWeight,
    });
  } catch (err) {
    console.error("Error fetching user stats:", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
