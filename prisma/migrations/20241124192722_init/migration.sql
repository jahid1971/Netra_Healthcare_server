/*
  Warnings:

  - You are about to drop the column `payment` on the `Appointment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Appointment" DROP COLUMN "payment",
ADD COLUMN     "PaymentStatus" "PaymentStatus" NOT NULL DEFAULT 'UNPAID';
