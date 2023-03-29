-- AlterTable
ALTER TABLE "Image" ADD COLUMN     "action_id" TEXT;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_action_id_fkey" FOREIGN KEY ("action_id") REFERENCES "ArticleAction"("id") ON DELETE SET NULL ON UPDATE CASCADE;
