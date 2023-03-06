-- CreateTable
CREATE TABLE "ArticleAction" (
    "id" TEXT NOT NULL,
    "discount" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "date" TIMESTAMP(3),
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ArticleAction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActionsOnArticle" (
    "article_id" TEXT NOT NULL,
    "article_action_id" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ActionsOnArticle_pkey" PRIMARY KEY ("article_id","article_action_id")
);

-- AddForeignKey
ALTER TABLE "ActionsOnArticle" ADD CONSTRAINT "ActionsOnArticle_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "Article"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActionsOnArticle" ADD CONSTRAINT "ActionsOnArticle_article_action_id_fkey" FOREIGN KEY ("article_action_id") REFERENCES "ArticleAction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
