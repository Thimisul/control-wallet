import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import TableOperation from "./_components/table/table"

const OperationPage = () => {
    return (
        <>
          <div className="container mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Categorias</CardTitle>
            </CardHeader>
            </Card>
            </div>
          <TableOperation></TableOperation>
          </>
      );
}


export default OperationPage