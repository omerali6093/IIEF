/*
  Warnings:

  - You are about to drop the column `bloodPressure` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `weightRange` on the `Patient` table. All the data in the column will be lost.
  - Added the required column `maritalStatus` to the `Patient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tobaccoUse` to the `Patient` table without a default value. This is not possible if the table is not empty.
  - Made the column `ageGroup` on table `Patient` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Patient" DROP COLUMN "bloodPressure",
DROP COLUMN "weightRange",
ADD COLUMN     "adultConfirmed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "conditions" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "maritalStatus" TEXT NOT NULL,
ADD COLUMN     "tobaccoUse" TEXT NOT NULL,
ALTER COLUMN "fullName" DROP NOT NULL,
ALTER COLUMN "age" DROP NOT NULL,
ALTER COLUMN "ageGroup" SET NOT NULL;
