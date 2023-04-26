-- CreateTable
CREATE TABLE "Worker" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "Worker_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Worker_user_id_key" ON "Worker"("user_id");

-- AddForeignKey
ALTER TABLE "Worker" ADD CONSTRAINT "Worker_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
