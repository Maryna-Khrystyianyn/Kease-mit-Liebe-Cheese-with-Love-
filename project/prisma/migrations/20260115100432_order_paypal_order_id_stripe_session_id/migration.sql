/*
  Warnings:

  - A unique constraint covering the columns `[paypal_order_id]` on the table `orders` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[stripe_session_id]` on the table `orders` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "paypal_order_id" TEXT,
ADD COLUMN     "stripe_session_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "orders_paypal_order_id_key" ON "orders"("paypal_order_id");

-- CreateIndex
CREATE UNIQUE INDEX "orders_stripe_session_id_key" ON "orders"("stripe_session_id");
