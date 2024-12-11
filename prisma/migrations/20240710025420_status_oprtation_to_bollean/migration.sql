/*
  Warnings:

  - The `statusEntrance` column on the `Operation` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `statusExit` column on the `Operation` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Operation" DROP COLUMN "statusEntrance",
ADD COLUMN     "statusEntrance" BOOLEAN NOT NULL DEFAULT false,
DROP COLUMN "statusExit",
ADD COLUMN     "statusExit" BOOLEAN NOT NULL DEFAULT false;
