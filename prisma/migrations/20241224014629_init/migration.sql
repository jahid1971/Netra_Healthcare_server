/*
  Warnings:

  - You are about to drop the column `notes` on the `Prescription` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Prescription" DROP COLUMN "notes",
ADD COLUMN     "note" TEXT;
