/*
  Warnings:

  - The values [Rennet] on the enum `ingredients_type` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ingredients_type_new" AS ENUM ('Milk', 'Starter culture', 'Salt', 'Spice', 'Additive', 'Coating', 'Concervant', 'Colorant', 'Enzyme', 'Other');
ALTER TABLE "public"."ingredients" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "ingredients" ALTER COLUMN "type" TYPE "ingredients_type_new" USING ("type"::text::"ingredients_type_new");
ALTER TYPE "ingredients_type" RENAME TO "ingredients_type_old";
ALTER TYPE "ingredients_type_new" RENAME TO "ingredients_type";
DROP TYPE "public"."ingredients_type_old";
ALTER TABLE "ingredients" ALTER COLUMN "type" SET DEFAULT 'Other';
COMMIT;
