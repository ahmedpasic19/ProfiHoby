/*
  Warnings:

  - You are about to drop the column `article_action_id` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the column `action_id` on the `Image` table. All the data in the column will be lost.
  - You are about to drop the `ArticleAction` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Article" DROP CONSTRAINT "Article_article_action_id_fkey";

-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_action_id_fkey";

-- AlterTable
ALTER TABLE "Article" DROP COLUMN "article_action_id",
ADD COLUMN     "discountPercentage" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "discountPrice" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "onDiscount" BOOLEAN DEFAULT false;

-- AlterTable
ALTER TABLE "Image" DROP COLUMN "action_id";

-- DropTable
DROP TABLE "ArticleAction";
