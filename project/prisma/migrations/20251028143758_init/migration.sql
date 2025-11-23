-- CreateEnum
CREATE TYPE "ingredients_type" AS ENUM ('Milk', 'Starter culture', 'Rennet', 'Salt', 'Spice', 'Additive', 'Coating', 'Concervant', 'Colorant', 'Enzyme', 'Other');

-- CreateEnum
CREATE TYPE "order_status" AS ENUM ('pending', 'processing', 'paid', 'shipped', 'delivered', 'cancelled', 'refunded');

-- CreateEnum
CREATE TYPE "user_status" AS ENUM ('admin', 'basic', 'standard', 'premium', 'user');

-- CreateTable
CREATE TABLE "batch_coments" (
    "id" SERIAL NOT NULL,
    "batche_id" INTEGER NOT NULL,
    "user_nick" VARCHAR NOT NULL,
    "date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "text" JSONB NOT NULL,

    CONSTRAINT "batch_coments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "batch_notes" (
    "id" SERIAL NOT NULL,
    "batche_id" INTEGER NOT NULL,
    "date" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "title" JSONB NOT NULL,
    "text" JSONB,

    CONSTRAINT "batch_notes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cart" (
    "user_nick" VARCHAR NOT NULL,
    "cart_items_id" INTEGER NOT NULL,
    "total_price" DECIMAL(10,2),

    CONSTRAINT "cart_pkey" PRIMARY KEY ("user_nick")
);

-- CreateTable
CREATE TABLE "cart_items" (
    "id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "cart_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cheese_batches" (
    "id" SERIAL NOT NULL,
    "recipe_id" INTEGER NOT NULL,
    "user_nick" VARCHAR NOT NULL,
    "date_batch" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "created_at" DATE,
    "ready_at" DATE,
    "description" JSONB,
    "foto" VARCHAR(50),
    "cheeseweight" DECIMAL(10,3),
    "ispublic" BOOLEAN DEFAULT false,

    CONSTRAINT "cheese_batches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "favorite_recipes" (
    "recipe_id" INTEGER NOT NULL,
    "user_nick" VARCHAR NOT NULL,

    CONSTRAINT "favorite_recipes_pkey" PRIMARY KEY ("recipe_id","user_nick")
);

-- CreateTable
CREATE TABLE "ingredients" (
    "id" SERIAL NOT NULL,
    "name" JSONB,
    "type" "ingredients_type" NOT NULL DEFAULT 'Other',
    "description" JSONB,
    "unit" VARCHAR(10),

    CONSTRAINT "ingredients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "milk_in_batch" (
    "batch_id" INTEGER NOT NULL,
    "milk_id" INTEGER NOT NULL,
    "amount" INTEGER,

    CONSTRAINT "milk_in_batch_pkey" PRIMARY KEY ("batch_id","milk_id")
);

-- CreateTable
CREATE TABLE "order_items" (
    "id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "total_price" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "order_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" SERIAL NOT NULL,
    "user_nick" VARCHAR NOT NULL,
    "order_items_id" INTEGER NOT NULL,
    "date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "total_price" DECIMAL(10,2) NOT NULL,
    "discount" DECIMAL(10,2),
    "comment" VARCHAR(500),
    "shipp_address" JSONB NOT NULL,
    "status" "order_status" NOT NULL DEFAULT 'pending',

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" SERIAL NOT NULL,
    "name" JSONB NOT NULL,
    "category_id" INTEGER NOT NULL,
    "description" JSONB,
    "price" DECIMAL(10,2) NOT NULL,
    "avaible" BOOLEAN,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products_categories" (
    "id" SERIAL NOT NULL,
    "name" JSONB NOT NULL,
    "body" JSONB,

    CONSTRAINT "products_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recipe_ingredients" (
    "recipe_id" INTEGER NOT NULL,
    "ingredient_id" INTEGER NOT NULL,
    "amount" INTEGER,

    CONSTRAINT "recipe_ingredients_pkey" PRIMARY KEY ("recipe_id","ingredient_id")
);

-- CreateTable
CREATE TABLE "recipes" (
    "id" SERIAL NOT NULL,
    "category_id" INTEGER NOT NULL,
    "name" JSONB NOT NULL,
    "body" JSONB,
    "created_at" TIMESTAMP(6),
    "aging" INTEGER,
    "ispublic" BOOLEAN DEFAULT false,

    CONSTRAINT "recipes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recipes_categories" (
    "id" SERIAL NOT NULL,
    "name" JSONB NOT NULL,
    "body" JSONB,

    CONSTRAINT "recipes_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscribe" (
    "email" VARCHAR(250) NOT NULL,

    CONSTRAINT "subscribe_pkey" PRIMARY KEY ("email")
);

-- CreateTable
CREATE TABLE "users" (
    "nick_name" VARCHAR(100) NOT NULL,
    "username" VARCHAR(100) NOT NULL,
    "email" VARCHAR(250) NOT NULL,
    "password" VARCHAR(30) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "telefon" VARCHAR(30),
    "user_status" "user_status" NOT NULL DEFAULT 'user',
    "avatar" VARCHAR(50),
    "mood" JSONB,
    "info" JSONB,
    "user_address" JSONB,
    "latitude" DECIMAL(9,6),
    "longitude" DECIMAL(9,6),
    "ispublic" BOOLEAN DEFAULT true,
    "issubscribed" BOOLEAN DEFAULT true,

    CONSTRAINT "users_pkey" PRIMARY KEY ("nick_name")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "batch_coments" ADD CONSTRAINT "batch_coments_batche_id_fkey" FOREIGN KEY ("batche_id") REFERENCES "cheese_batches"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "batch_coments" ADD CONSTRAINT "batch_coments_user_nick_fkey" FOREIGN KEY ("user_nick") REFERENCES "users"("nick_name") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "batch_notes" ADD CONSTRAINT "batch_notes_batche_id_fkey" FOREIGN KEY ("batche_id") REFERENCES "cheese_batches"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "cart" ADD CONSTRAINT "cart_cart_items_id_fkey" FOREIGN KEY ("cart_items_id") REFERENCES "cart_items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "cart" ADD CONSTRAINT "cart_user_nick_fkey" FOREIGN KEY ("user_nick") REFERENCES "users"("nick_name") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "cheese_batches" ADD CONSTRAINT "cheese_batches_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "recipes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "cheese_batches" ADD CONSTRAINT "cheese_batches_user_nick_fkey" FOREIGN KEY ("user_nick") REFERENCES "users"("nick_name") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "favorite_recipes" ADD CONSTRAINT "favorite_recipes_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "recipes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "favorite_recipes" ADD CONSTRAINT "favorite_recipes_user_nick_fkey" FOREIGN KEY ("user_nick") REFERENCES "users"("nick_name") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "milk_in_batch" ADD CONSTRAINT "milk_in_batch_batch_id_fkey" FOREIGN KEY ("batch_id") REFERENCES "cheese_batches"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "milk_in_batch" ADD CONSTRAINT "milk_in_batch_milk_id_fkey" FOREIGN KEY ("milk_id") REFERENCES "ingredients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_order_items_id_fkey" FOREIGN KEY ("order_items_id") REFERENCES "order_items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_nick_fkey" FOREIGN KEY ("user_nick") REFERENCES "users"("nick_name") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "products_categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "recipe_ingredients" ADD CONSTRAINT "recipe_ingredients_ingredient_id_fkey" FOREIGN KEY ("ingredient_id") REFERENCES "ingredients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "recipe_ingredients" ADD CONSTRAINT "recipe_ingredients_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "recipes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "recipes" ADD CONSTRAINT "recipes_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "recipes_categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
