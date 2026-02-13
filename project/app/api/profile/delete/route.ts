import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "../../../utils/auth";

export async function DELETE(req: NextRequest) {
  try {
    // 🔐 Securely get the user from JWT
    const user = await requireUser();

    // Delete user (Prisma should handle related data if cascades are set, 
    // but here we might need to manually handle some if constraints fail)
    // For this educational project, we'll attempt a direct delete.
    
    // We need to delete related data because of ON DELETE NO ACTION in schema
    // 1. Favorite recipes
    await prisma.favorite_recipes.deleteMany({
        where: { user_nick: user.nick_name }
    });

    // 2. Batch comments
    await prisma.batch_coments.deleteMany({
        where: { user_nick: user.nick_name }
    });

    // 3. Cheese batches (and their notes/comments)
    // Usually batches have notes/comments, we need to clear them too if NoAction
    const batches = await prisma.cheese_batches.findMany({
        where: { user_nick: user.nick_name },
        select: { id: true }
    });
    const batchIds = batches.map(b => b.id);

    if (batchIds.length > 0) {
        await prisma.batch_notes.deleteMany({
            where: { batche_id: { in: batchIds } }
        });
        await prisma.batch_coments.deleteMany({
            where: { batche_id: { in: batchIds } }
        });
        await prisma.milk_in_batch.deleteMany({
            where: { batch_id: { in: batchIds } }
        });
        await prisma.cheese_batches.deleteMany({
            where: { id: { in: batchIds } }
        });
    }

    // 4. Cart
    await prisma.cart_items.deleteMany({
        where: { cart_nick: user.nick_name }
    });
    await prisma.cart.deleteMany({
        where: { user_nick: user.nick_name }
    });

    // 5. Orders - usually we don't delete orders for history, 
    // but here users.nick_name is the ID, so we might need to set user_nick to null 
    // if we want to keep them, or delete them.
    // Given the request "Delete account", we'll just delete them for simplicity in this project.
    await prisma.order_items.deleteMany({
        where: { orders: { user_nick: user.nick_name } }
    });
    await prisma.orders.deleteMany({
        where: { user_nick: user.nick_name }
    });

    // Finally, delete the user
    await prisma.users.delete({
      where: {
        nick_name: user.nick_name,
      },
    });

    const response = NextResponse.json({ message: "Account erfolgreich gelöscht" });
    
    // Clear the cookie for the web session if any
    response.cookies.set({
      name: "token",
      value: "",
      path: "/",
      maxAge: 0,
    });

    return response;
  } catch (error) {
    console.error("ACCOUNT DELETION ERROR:", error);
    return NextResponse.json(
      { error: "Fehler beim Löschen des Kontos" },
      { status: 500 }
    );
  }
}
