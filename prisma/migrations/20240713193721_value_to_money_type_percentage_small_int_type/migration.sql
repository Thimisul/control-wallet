/*
  Warnings:

  - You are about to alter the column `percentage` on the `ConfigurationCategory` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `SmallInt`.
  - The `initialValue` column on the `Wallet` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `value` on the `Operation` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "ConfigurationCategory" ALTER COLUMN "percentage" SET DATA TYPE SMALLINT;

-- AlterTable
ALTER TABLE "Operation" DROP COLUMN "value",
ADD COLUMN     "value" MONEY NOT NULL;

-- AlterTable
ALTER TABLE "Wallet" DROP COLUMN "initialValue",
ADD COLUMN     "initialValue" MONEY;
