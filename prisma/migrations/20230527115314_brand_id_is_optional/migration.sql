-- DropForeignKey
ALTER TABLE "Article" DROP CONSTRAINT "Article_brand_id_fkey";

-- AlterTable
ALTER TABLE "Article" ALTER COLUMN "brand_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Article" ADD CONSTRAINT "Article_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "Brand"("id") ON DELETE SET NULL ON UPDATE CASCADE;
