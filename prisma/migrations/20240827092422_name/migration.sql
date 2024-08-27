-- AlterTable
ALTER TABLE "Blog" ALTER COLUMN "imageurl" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "imageurl" DROP NOT NULL,
ALTER COLUMN "fileurl" DROP NOT NULL;
