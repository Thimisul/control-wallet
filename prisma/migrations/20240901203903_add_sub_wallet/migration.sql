-- AlterTable
ALTER TABLE "Wallet" ADD COLUMN     "walletId" INTEGER;

-- AddForeignKey
ALTER TABLE "Wallet" ADD CONSTRAINT "Wallet_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet"("id") ON DELETE SET NULL ON UPDATE CASCADE;
