import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import TableWallet from "./_components/table/table";

export default async function WalletPage() {
  return (
    <>
      {/* <WalletForm user={session?.user} action={walletAction}></WalletForm> */}
      <div className="container mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Carteiras</CardTitle>
        </CardHeader>
        </Card>
        </div>
      <TableWallet></TableWallet>
      </>
  );
}