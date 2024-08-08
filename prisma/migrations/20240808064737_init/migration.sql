/*
  Warnings:

  - You are about to drop the column `otpcode` on the `Otp` table. All the data in the column will be lost.
  - Added the required column `code` to the `Otp` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Otp" DROP COLUMN "otpcode",
ADD COLUMN     "code" INTEGER NOT NULL;
