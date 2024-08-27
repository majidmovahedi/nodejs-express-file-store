/*
  Warnings:

  - Made the column `imageurl` on table `Blog` required. This step will fail if there are existing NULL values in that column.
  - Made the column `imageurl` on table `Product` required. This step will fail if there are existing NULL values in that column.
  - Made the column `fileurl` on table `Product` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Blog" ALTER COLUMN "imageurl" SET NOT NULL;

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "imageurl" SET NOT NULL,
ALTER COLUMN "fileurl" SET NOT NULL;
