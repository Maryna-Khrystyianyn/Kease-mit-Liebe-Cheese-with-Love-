/*
  Warnings:

  - You are about to drop the column `shipp_address` on the `orders` table. All the data in the column will be lost.
  - Added the required column `city` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `street` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `zip` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "orders" DROP COLUMN "shipp_address",
ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "country" TEXT NOT NULL,
ADD COLUMN     "delivery_price" DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN     "payment_method" TEXT,
ADD COLUMN     "payment_status" TEXT NOT NULL DEFAULT 'pending',
ADD COLUMN     "street" TEXT NOT NULL,
ADD COLUMN     "zip" TEXT NOT NULL;
