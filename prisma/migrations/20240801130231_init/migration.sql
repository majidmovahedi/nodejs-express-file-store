/*
  Warnings:

  - Added the required column `otpId` to the `Otp` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Otp" DROP CONSTRAINT "Otp_id_fkey";

-- AlterTable
ALTER TABLE "Otp" ADD COLUMN     "otpId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Otp" ADD CONSTRAINT "Otp_otpId_fkey" FOREIGN KEY ("otpId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
