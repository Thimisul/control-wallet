import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Prisma } from "@prisma/client"
import Link from "next/link"

type WalletWithParticipantsCardProps = {
  data: any
}

const WalletCard = ({ data }: WalletWithParticipantsCardProps) => {
  console.log(data)
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle><Link href={`/app/wallet/${data.id}`}>{data.name}</Link></CardTitle>
        <CardDescription  className="ml-auto">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder-user.jpg" />
                    <AvatarFallback>{data.owner.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                </TooltipTrigger>
                <TooltipContent>{data.owner.name}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
      <div className="grid grid-cols-2 gap-2">
          <span className="text-muted-foreground">Balanço</span>
          <span className="text-right font-medium">{data.operations.operationsCompletedTotal}</span>
        </div>
        <Separator />
        <div className="grid grid-cols-2 gap-2">
          <span className="text-muted-foreground">Pendente de Entrada</span>
          <span className="text-right font-medium">{data.operations.operationsEntrancePendent}</span>
          <span className="text-muted-foreground">Pendente de Saída</span>
          <span className="text-right font-medium">{data.operations.operationsExitsPendent}</span>
          <span className="text-muted-foreground">Total Pendente</span>
          <span className="text-right font-medium">{data.operations.operationsPendentTotal}</span>
        </div>
        <Separator />
        <div className="grid grid-cols-2 gap-2">
          <span className="text-muted-foreground">Entrada</span>
          <span className="text-right font-medium">{data.operations.operationsEntranceCompleted}</span>
          <span className="text-muted-foreground">Saída</span>
          <span className="text-right font-medium">{data.operations.operationsExitsCompleted}</span>
          <span className="text-muted-foreground">Total</span>
          <span className="text-right font-medium">{data.operations.operationsCompletedTotal}</span>
        </div>
        <Separator />
        <div className="grid grid-cols-2 gap-2">
          <span className="text-muted-foreground">Pendente vs Balanço</span>
          <span className="text-right font-medium text-green-500">{data.operations.operationsTotal}</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <span className="text-muted-foreground">Participants</span>
          <div className="text-right font-medium">
            <TooltipProvider>
              <div className="flex items-center gap-2 flex-wrap">
                {data.participants && data.participants.map((participant: any) => (
                  <Tooltip key={participant.id}>
                    <TooltipTrigger asChild>
                      <Avatar>
                        <AvatarImage src="/placeholder-user.jpg" />
                        <AvatarFallback>{participant.user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </TooltipTrigger>
                    <TooltipContent>{participant.user.name}</TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </TooltipProvider>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">View Transactions</Button>
      </CardFooter>
    </Card>
  )
}
export default WalletCard