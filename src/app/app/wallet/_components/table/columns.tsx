"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { WalletGetPayloadType } from "@/data/wallets"
import { Participant, User, Wallet } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

type ParticipantWithUserType = {
  user: {
    name: string;
    id: string;
  },
  wallet: {
    name: string;
    id: string;
  },
  percentage: number;
};

export const columns: ColumnDef<WalletGetPayloadType>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Nome",
  },
  {
    accessorKey: "initialValue",
    header: "Valor Inicial",
    cell: (initialValue) => {
      return (
          'R$ '+ Number(initialValue.getValue()).toFixed(2).toLocaleString()
      )
    },
  },
  {
    accessorKey: "isVisible",
    header: "Visível",
    cell: (isVisible) => {
      return (
        <Badge key={isVisible.row.id} variant={isVisible.getValue() ? "default" : "destructive"}>
          {isVisible.getValue() ? "Sim" : "Não"}
        </Badge>
      )
    },
  },
  {
    accessorKey: "participants",
    header: "Participantes",
    cell: (participantsList) => {
      const participants = participantsList.getValue() as ParticipantWithUserType[]
      return participants.map((participant => {
        if (participant.user) {
          return (
            <>
              <TooltipProvider key={participant.user.id + participant.wallet.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant={"secondary"} className="mr-2 ">
                      {participant.user.name}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className=" bg-foreground text-background">
                    <p>{participant.percentage}%</p>
                    <Progress value={participant.percentage} className="w-[100%]" />
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </>
          )
        }
      }))
    },
  },
]
