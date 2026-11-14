/*
  Warnings:

  - The primary key for the `AnswerOption` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Question` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Questionnaire` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `Questionnaire` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[questionId,optionOrder]` on the table `AnswerOption` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[code,version,language]` on the table `Questionnaire` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `Questionnaire` table without a default value. This is not possible if the table is not empty.
  - Added the required column `language` to the `Questionnaire` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AnswerOption" DROP CONSTRAINT "AnswerOption_questionId_fkey";

-- DropForeignKey
ALTER TABLE "Question" DROP CONSTRAINT "Question_questionnaireId_fkey";

-- AlterTable
ALTER TABLE "AnswerOption" DROP CONSTRAINT "AnswerOption_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "questionId" SET DATA TYPE TEXT,
ADD CONSTRAINT "AnswerOption_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Question" DROP CONSTRAINT "Question_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "questionnaireId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Question_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Questionnaire" DROP CONSTRAINT "Questionnaire_pkey",
DROP COLUMN "createdAt",
ADD COLUMN     "code" TEXT NOT NULL,
ADD COLUMN     "language" TEXT NOT NULL,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Questionnaire_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "AnswerOption_questionId_optionOrder_key" ON "AnswerOption"("questionId", "optionOrder");

-- CreateIndex
CREATE UNIQUE INDEX "Questionnaire_code_version_language_key" ON "Questionnaire"("code", "version", "language");

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_questionnaireId_fkey" FOREIGN KEY ("questionnaireId") REFERENCES "Questionnaire"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnswerOption" ADD CONSTRAINT "AnswerOption_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;
