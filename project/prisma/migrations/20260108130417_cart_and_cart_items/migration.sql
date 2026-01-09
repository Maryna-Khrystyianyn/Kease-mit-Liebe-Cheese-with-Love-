/*
  Warnings:

  - You are about to drop the column `cart_items_id` on the `cart` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[cart_nick,product_id]` on the table `cart_items` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cart_nick` to the `cart_items` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "cart" DROP CONSTRAINT "cart_cart_items_id_fkey";

-- DropForeignKey
ALTER TABLE "cart" DROP CONSTRAINT "cart_user_nick_fkey";

-- DropForeignKey
ALTER TABLE "cart_items" DROP CONSTRAINT "cart_items_product_id_fkey";

-- AlterTable
ALTER TABLE "cart" DROP COLUMN "cart_items_id";

-- AlterTable
ALTER TABLE "cart_items" ADD COLUMN     "cart_nick" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "cart_items_cart_nick_product_id_key" ON "cart_items"("cart_nick", "product_id");

-- AddForeignKey
ALTER TABLE "cart" ADD CONSTRAINT "cart_user_nick_fkey" FOREIGN KEY ("user_nick") REFERENCES "users"("nick_name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_cart_nick_fkey" FOREIGN KEY ("cart_nick") REFERENCES "cart"("user_nick") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
