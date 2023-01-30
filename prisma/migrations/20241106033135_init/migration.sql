/*
  Warnings:

  - The primary key for the `DoctorSpecialty` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `specailtiesId` on the `DoctorSpecialty` table. All the data in the column will be lost.
  - Added the required column `specialtyId` to the `DoctorSpecialty` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "DoctorSpecialty" DROP CONSTRAINT "DoctorSpecialty_specailtiesId_fkey";

-- AlterTable
ALTER TABLE "DoctorSpecialty" DROP CONSTRAINT "DoctorSpecialty_pkey",
DROP COLUMN "specailtiesId",
ADD COLUMN     "specialtyId" TEXT NOT NULL,
ADD CONSTRAINT "DoctorSpecialty_pkey" PRIMARY KEY ("specialtyId", "doctorId");

-- AddForeignKey
ALTER TABLE "DoctorSpecialty" ADD CONSTRAINT "DoctorSpecialty_specialtyId_fkey" FOREIGN KEY ("specialtyId") REFERENCES "Specialty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
