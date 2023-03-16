/*
  Warnings:

  - You are about to drop the column `instructions` on the `Medication` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Medication" DROP COLUMN "instructions",
ADD COLUMN     "instruction" TEXT;

-- AlterTable
ALTER TABLE "Prescription" ADD COLUMN     "diagnosis" TEXT,
ADD COLUMN     "isDeleted" BOOLEAN DEFAULT false,
ADD COLUMN     "recommendedLabTests" TEXT;
