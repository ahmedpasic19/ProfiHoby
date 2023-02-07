/*
  Warnings:

  - You are about to drop the column `price_with_vat` on the `Article` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Article" DROP COLUMN "price_with_vat",
ALTER COLUMN "discount" DROP NOT NULL;
