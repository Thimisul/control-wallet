-- CreateEnum
CREATE TYPE "CategoryType" AS ENUM ('ENTRANCE', 'EXIT');

-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "type" "CategoryType" NOT NULL DEFAULT 'ENTRANCE';
