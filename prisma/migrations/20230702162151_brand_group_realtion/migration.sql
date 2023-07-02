-- AlterTable
ALTER TABLE "Brand" ADD COLUMN     "group_id" TEXT;

-- AddForeignKey
ALTER TABLE "Brand" ADD CONSTRAINT "Brand_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "Group"("id") ON DELETE SET NULL ON UPDATE CASCADE;
