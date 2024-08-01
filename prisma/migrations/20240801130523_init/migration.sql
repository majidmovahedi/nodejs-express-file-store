/*
  Warnings:

  - You are about to drop the `Otp` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Otp" DROP CONSTRAINT "Otp_userId_fkey";

-- DropTable
DROP TABLE "Otp";

-- CreateTable
CREATE TABLE "OtpTable" (
    "id" SERIAL NOT NULL,
    "code" INTEGER NOT NULL,
    "expire_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "OtpTable_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "OtpTable" ADD CONSTRAINT "OtpTable_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
