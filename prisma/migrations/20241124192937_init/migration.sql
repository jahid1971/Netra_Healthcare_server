/*
  Warnings:

  - You are about to drop the column `PaymentStatus` on the `Appointment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Appointment" DROP COLUMN "PaymentStatus",
ADD COLUMN     "payment" "PaymentStatus" NOT NULL DEFAULT 'UNPAID';
