-- AlterTable
ALTER TABLE "Operation" ADD COLUMN     "month" VARCHAR(7);

-- Atualiza a coluna 'month' com base na coluna 'date' para as linhas existentes
UPDATE "Operation"
SET "month" = TO_CHAR("date", 'YYYY-MM')
WHERE "month" IS NULL;