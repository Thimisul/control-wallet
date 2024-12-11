import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import TableCategory from "./_components/table/table";

export default async function CategoryPage() {
  return (
    <>
      {/* <CategoryForm user={session?.user} action={categoryAction}></CategoryForm> */}
      <div className="container mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Categorias</CardTitle>
        </CardHeader>
        </Card>
        </div>
      <TableCategory></TableCategory>
      </>
  );
}