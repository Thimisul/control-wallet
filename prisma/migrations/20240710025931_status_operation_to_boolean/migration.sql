/*
  Warnings:

  - The `statusOperation` column on the `Operation` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Operation" DROP COLUMN "statusOperation",
ADD COLUMN     "statusOperation" BOOLEAN NOT NULL DEFAULT false;
