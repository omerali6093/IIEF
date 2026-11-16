/*
  Warnings:

  - A unique constraint covering the columns `[reportAccessTokenHash]` on the table `Assessment` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Assessment" ADD COLUMN     "reportAccessExpiresAt" TIMESTAMP(3),
ADD COLUMN     "reportAccessTokenHash" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Assessment_reportAccessTokenHash_key" ON "Assessment"("reportAccessTokenHash");
