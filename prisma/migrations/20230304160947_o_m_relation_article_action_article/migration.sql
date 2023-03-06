/*
  Warnings:

  - You are about to drop the `ActionsOnArticle` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ActionsOnArticle" DROP CONSTRAINT "ActionsOnArticle_article_action_id_fkey";

-- DropForeignKey
ALTER TABLE "ActionsOnArticle" DROP CONSTRAINT "ActionsOnArticle_article_id_fkey";

-- AlterTable
ALTER TABLE "Article" ADD COLUMN     "article_action_id" TEXT;

-- DropTable
DROP TABLE "ActionsOnArticle";

-- AddForeignKey
ALTER TABLE "Article" ADD CONSTRAINT "Article_article_action_id_fkey" FOREIGN KEY ("article_action_id") REFERENCES "ArticleAction"("id") ON DELETE SET NULL ON UPDATE CASCADE;
