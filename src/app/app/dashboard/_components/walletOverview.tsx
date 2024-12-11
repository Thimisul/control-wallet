// src/app/app/dashboard/_components/WalletOverview.tsx
"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Wallet } from '../_type'

interface WalletOverviewProps {
  wallets: Wallet[];
  onSelectWallet: (wallet: Wallet) => void;
}

export default function WalletOverview({ wallets, onSelectWallet }: WalletOverviewProps) {
  const calculateWalletBalance = (wallet: Wallet) => {
    const totalEntrance = wallet.entrance_operations.reduce((sum, op) => sum + parseFloat(op.value), 0);
    const totalExit = wallet.exit_operations.reduce((sum, op) => sum + Math.abs(parseFloat(op.value)), 0);
    return totalEntrance - totalExit;
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Visão Geral das Carteiras</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Proprietário</TableHead>
                <TableHead className="text-right">Saldo</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {wallets.map((wallet) => (
                <TableRow key={wallet.id}>
                  <TableCell>{wallet.name}</TableCell>
                  <TableCell>{wallet.owner.name}</TableCell>
                  <TableCell className="text-right">
                    R$ {calculateWalletBalance(wallet).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Button onClick={() => onSelectWallet(wallet)}>Ver Detalhes</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Card>
                
      </Card>
    </>
  )
}