/*
  Warnings:

  - Made the column `month` on table `Operation` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Operation" ALTER COLUMN "month" SET NOT NULL;
