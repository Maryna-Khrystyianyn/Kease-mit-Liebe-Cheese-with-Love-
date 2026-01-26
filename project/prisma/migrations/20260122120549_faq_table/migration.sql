-- CreateEnum
CREATE TYPE "FAQCategory" AS ENUM ('ZahlungLieferung', 'LagerungTransportKulturen', 'KaseHerstellungNuancen', 'KaseReifungLagerungNuancen', 'Andere');

-- CreateTable
CREATE TABLE "FAQ" (
    "id" SERIAL NOT NULL,
    "category" "FAQCategory" NOT NULL,
    "tags" TEXT,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FAQ_pkey" PRIMARY KEY ("id")
);
