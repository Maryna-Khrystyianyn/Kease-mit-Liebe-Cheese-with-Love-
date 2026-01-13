/*
  Warnings:

  - Added the required column `email` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_user_nick_fkey";

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "email" TEXT NOT NULL,
ALTER COLUMN "user_nick" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_nick_fkey" FOREIGN KEY ("user_nick") REFERENCES "users"("nick_name") ON DELETE SET NULL ON UPDATE CASCADE;
