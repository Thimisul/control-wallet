'use client'
import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ArrowDownIcon, ArrowUpIcon, WalletIcon, ClockIcon, UsersIcon, CreditCardIcon } from 'lucide-react'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// Tipos
type MainCategory = 'Necessidades' | 'Desejos' | 'Poupança/Investimentos'
type TransactionStatus = 'efetivada' | 'pendente'
type TransactionType = 'normal' | 'creditCard'

type Transaction = {
  id: number
  category: string
  mainCategory: MainCategory
  amount: number
  date: string
  status: TransactionStatus
  type: TransactionType
  paymentDate?: string // Para transações de cartão de crédito
}

type User = {
  id: number
  name: string
  percentage: number
}

type Wallet = {
  id: number
  name: string
  transactions: Transaction[]
  users: User[]
  creditCardDueDate?: number // Dia do vencimento do cartão de crédito
}

// Dados de exemplo
const wallets: Wallet[] = [
  {
    id: 1,
    name: "Carteira Compartilhada",
    users: [
      { id: 1, name: "Alice", percentage: 60 },
      { id: 2, name: "Bob", percentage: 40 },
    ],
    transactions: [
      { id: 1, category: "Salário Alice", mainCategory: "Poupança/Investimentos", amount: 5000, date: "2023-06-01", status: "efetivada", type: "normal" },
      { id: 2, category: "Salário Bob", mainCategory: "Poupança/Investimentos", amount: 3000, date: "2023-06-01", status: "efetivada", type: "normal" },
      { id: 3, category: "Aluguel", mainCategory: "Necessidades", amount: -2000, date: "2023-06-05", status: "efetivada", type: "normal" },
      { id: 4, category: "Supermercado", mainCategory: "Necessidades", amount: -800, date: "2023-06-10", status: "efetivada", type: "normal" },
      { id: 5, category: "Restaurante", mainCategory: "Desejos", amount: -200, date: "2023-06-15", status: "efetivada", type: "creditCard", paymentDate: "2023-07-10" },
      { id: 6, category: "Cinema", mainCategory: "Desejos", amount: -100, date: "2023-06-25", status: "efetivada", type: "creditCard", paymentDate: "2023-07-10" },
      { id: 7, category: "Conta de Luz", mainCategory: "Necessidades", amount: -150, date: "2023-07-10", status: "pendente", type: "normal" },
    ],
    creditCardDueDate: 10
  },
  {
    id: 2,
    name: "Carteira de Investimentos",
    users: [
      { id: 1, name: "Alice", percentage: 70 },
      { id: 2, name: "Bob", percentage: 30 },
    ],
    transactions: [
      { id: 8, category: "Dividendos", mainCategory: "Poupança/Investimentos", amount: 500, date: "2023-06-01", status: "efetivada", type: "normal" },
      { id: 9, category: "Compra de Ações", mainCategory: "Poupança/Investimentos", amount: -2000, date: "2023-06-07", status: "efetivada", type: "normal" },
      { id: 10, category: "Venda de Ações", mainCategory: "Poupança/Investimentos", amount: 2500, date: "2023-06-20", status: "efetivada", type: "normal" },
      { id: 11, category: "Dividendos Previstos", mainCategory: "Poupança/Investimentos", amount: 300, date: "2023-07-15", status: "pendente", type: "normal" },
    ]
  },
]

const COLORS = {
  'Necessidades': 'hsl(var(--chart-1))',
  'Desejos': 'hsl(var(--chart-2))',
  'Poupança/Investimentos': 'hsl(var(--chart-3))'
}

export default function DashboardFinanceiro() {
  const [selectedWallet, setSelectedWallet] = useState<Wallet>(wallets[0])
  const [isAddingTransaction, setIsAddingTransaction] = useState(false)
  const [newTransaction, setNewTransaction] = useState<Partial<Transaction>>({
    category: '',
    mainCategory: 'Necessidades',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    status: 'efetivada',
    type: 'normal'
  })

  const calculateBalance = (transactions: Transaction[], includePending: boolean = false, includeCreditCard: boolean = false) => {
    return transactions
      .filter(t => (includePending || t.status === 'efetivada') && (includeCreditCard || t.type === 'normal'))
      .reduce((acc, t) => acc + t.amount, 0)
      .toFixed(2)
  }

  const calculateUserBalance = (user: User, transactions: Transaction[], includePending: boolean = false, includeCreditCard: boolean = false) => {
    const totalBalance = Number(calculateBalance(transactions, includePending, includeCreditCard))
    return (totalBalance * user.percentage / 100).toFixed(2)
  }

  const prepareChartData = (transactions: Transaction[]) => {
    const sortedTransactions = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    let balance = 0
    let pendingBalance = 0
    let creditCardBalance = 0
    return sortedTransactions.map(t => {
      if (t.status === 'efetivada') {
        if (t.type === 'normal') {
          balance += t.amount
        } else if (t.type === 'creditCard') {
          creditCardBalance += t.amount
        }
      } else {
        pendingBalance += t.amount
      }
      return { 
        date: t.date, 
        balance: balance,
        balanceWithPending: balance + pendingBalance,
        balanceWithCreditCard: balance + creditCardBalance
      }
    })
  }

  const prepareCategoryData = (transactions: Transaction[]) => {
    const categoryTotals: { [key: string]: { efetivado: number, pendente: number, creditCard: number } } = {}
    transactions.forEach(t => {
      if (!categoryTotals[t.category]) {
        categoryTotals[t.category] = { efetivado: 0, pendente: 0, creditCard: 0 }
      }
      if (t.status === 'efetivada') {
        if (t.type === 'normal') {
          categoryTotals[t.category].efetivado += Math.abs(t.amount)
        } else if (t.type === 'creditCard') {
          categoryTotals[t.category].creditCard += Math.abs(t.amount)
        }
      } else {
        categoryTotals[t.category].pendente += Math.abs(t.amount)
      }
    })
    return Object.entries(categoryTotals).map(([category, totals]) => ({ 
      category, 
      efetivado: totals.efetivado,
      pendente: totals.pendente,
      creditCard: totals.creditCard
    }))
  }

  const prepareMainCategoryData = (transactions: Transaction[]) => {
    const mainCategoryTotals: { [key in MainCategory]: { efetivado: number, pendente: number, creditCard: number } } = {
      'Necessidades': { efetivado: 0, pendente: 0, creditCard: 0 },
      'Desejos': { efetivado: 0, pendente: 0, creditCard: 0 },
      'Poupança/Investimentos': { efetivado: 0, pendente: 0, creditCard: 0 }
    }
    transactions.forEach(t => {
      if (t.amount < 0) { // Only consider expenses for 50-30-20 rule
        if (t.status === 'efetivada') {
          if (t.type === 'normal') {
            mainCategoryTotals[t.mainCategory].efetivado += Math.abs(t.amount)
          } else if (t.type === 'creditCard') {
            mainCategoryTotals[t.mainCategory].creditCard += Math.abs(t.amount)
          }
        } else {
          mainCategoryTotals[t.mainCategory].pendente += Math.abs(t.amount)
        }
      }
    })
    const totalExpenses = Object.values(mainCategoryTotals).reduce((a, b) => a + b.efetivado + b.pendente + b.creditCard, 0)
    return Object.entries(mainCategoryTotals).map(([category, totals]) => ({
      category,
      efetivado: totals.efetivado,
      pendente: totals.pendente,
      creditCard: totals.creditCard,
      total: totals.efetivado + totals.pendente + totals.creditCard,
      percentage: totalExpenses > 0 ? ((totals.efetivado + totals.pendente + totals.creditCard) / totalExpenses * 100).toFixed(1) : 0
    }))
  }

  const handleAddTransaction = () => {
    if (newTransaction.category && newTransaction.amount && newTransaction.date) {
      const updatedWallet = { ...selectedWallet }
      const newId = Math.max(...updatedWallet.transactions.map(t => t.id)) + 1
      const transaction: Transaction = {
        id: newId,
        category: newTransaction.category,
        mainCategory: newTransaction.mainCategory as MainCategory,
        amount: Number(newTransaction.amount),
        date: newTransaction.date,
        status: newTransaction.status as TransactionStatus,
        type: newTransaction.type as TransactionType,
      }
      if (transaction.type === 'creditCard') {
        const dueDate = new Date(transaction.date)
        dueDate.setMonth(dueDate.getMonth() + 1)
        dueDate.setDate(selectedWallet.creditCardDueDate || 1)
        transaction.paymentDate = dueDate.toISOString().split('T')[0]
      }
      updatedWallet.transactions.push(transaction)
      setSelectedWallet(updatedWallet)
      setIsAddingTransaction(false)
      setNewTransaction({
        category: '',
        mainCategory: 'Necessidades',
        amount: 0,
        date: new Date().toISOString().split('T')[0],
        status: 'efetivada',
        type: 'normal'
      })
    }
  }

  return (
    <div className="container mx-auto p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Dashboard Financeiro</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Select
              value={selectedWallet.id.toString()}
              onValueChange={(value) => setSelectedWallet(wallets.find(w => w.id.toString() === value) || wallets[0])}
            >
              <SelectTrigger className="w-[280px]">
                <SelectValue placeholder="Selecione uma carteira" />
              </SelectTrigger>
              <SelectContent>
                {wallets.map((wallet) => (
                  <SelectItem key={wallet.id} value={wallet.id.toString()}>
                    <div className="flex items-center">
                      <WalletIcon className="mr-2 h-4 w-4" />
                      <span>{wallet.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div>
              <p className="text-sm font-medium">Saldo: R$ {calculateBalance(selectedWallet.transactions)}</p>
              <p className="text-xs text-muted-foreground">
                Pendente: R$ {(Number(calculateBalance(selectedWallet.transactions, true)) - Number(calculateBalance(selectedWallet.transactions))).toFixed(2)}
              </p>
              <p className="text-xs text-muted-foreground">
                Cartão de Crédito: R$ {Math.abs(Number(calculateBalance(selectedWallet.transactions, true, true)) - Number(calculateBalance(selectedWallet.transactions, true))).toFixed(2)}
              </p>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <UsersIcon className="h-4 w-4 mr-1" />
              {selectedWallet.users.length} usuários
            </div>
          </div>
        
        </CardContent>
      </Card>
      
      <Card className="flex-1">
        <CardContent className="pt-6">
          <Tabs defaultValue="transactions" className="space-y-4">
            <TabsList>
              <TabsTrigger value="transactions">Transações</TabsTrigger>
              <TabsTrigger value="charts">Gráficos</TabsTrigger>
              <TabsTrigger value="50-30-20">Regra 50-30-20</TabsTrigger>
              <TabsTrigger value="users">Usuários</TabsTrigger>
            </TabsList>
            <TabsContent value="transactions">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Transações</h3>
                <Dialog open={isAddingTransaction} onOpenChange={setIsAddingTransaction}>
                  <DialogTrigger asChild>
                    <Button>Adicionar Transação</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Adicionar Nova Transação</DialogTitle>
                      <DialogDescription>Preencha os detalhes da nova transação abaixo.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="category" className="text-right">Categoria</Label>
                        <Input id="category" className="col-span-3" value={newTransaction.category} onChange={(e) => setNewTransaction({...newTransaction, category: e.target.value})} />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="mainCategory" className="text-right">Categoria Principal</Label>
                        <Select value={newTransaction.mainCategory} onValueChange={(value) => setNewTransaction({...newTransaction, mainCategory: value as MainCategory})}>
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Selecione a categoria principal" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Necessidades">Necessidades</SelectItem>
                            <SelectItem value="Desejos">Desejos</SelectItem>
                            <SelectItem value="Poupança/Investimentos">Poupança/Investimentos</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="amount" className="text-right">Valor</Label>
                        <Input id="amount" type="number" className="col-span-3" value={newTransaction.amount} onChange={(e) => setNewTransaction({...newTransaction, amount: Number(e.target.value)})} />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="date" className="text-right">Data</Label>
                        <Input id="date" type="date" className="col-span-3" value={newTransaction.date} onChange={(e) => setNewTransaction({...newTransaction, date: e.target.value})} />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="status" className="text-right">Status</Label>
                        <Select value={newTransaction.status} onValueChange={(value) => setNewTransaction({...newTransaction, status: value as TransactionStatus})}>
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Selecione o status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="efetivada">Efetivada</SelectItem>
                            <SelectItem value="pendente">Pendente</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="type" className="text-right">Tipo</Label>
                        <Select value={newTransaction.type} onValueChange={(value) => setNewTransaction({...newTransaction, type: value as TransactionType})}>
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="normal">Normal</SelectItem>
                            <SelectItem value="creditCard">Cartão de Crédito</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={handleAddTransaction}>Adicionar Transação</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              <ScrollArea className="h-[calc(100vh-400px)]">
                {selectedWallet.transactions.map((transaction) => (
                  <div key={transaction.id} className="mb-4 p-2 border-b last:border-b-0">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{transaction.category}</span>
                      <div className="flex items-center gap-2">
                        {transaction.status === 'pendente' && (
                          <Badge variant="outline" className="text-yellow-500">
                            <ClockIcon className="h-3 w-3 mr-1" />
                            Pendente
                          </Badge>
                        )}
                        {transaction.type === 'creditCard' && (
                          <Badge variant="outline" className="text-blue-500">
                            <CreditCardIcon className="h-3 w-3 mr-1" />
                            Cartão de Crédito
                          </Badge>
                        )}
                        <Badge variant={transaction.amount > 0 ? "default" : "destructive"}>
                          {transaction.amount > 0 ? (
                            <ArrowUpIcon className="mr-1 h-3 w-3" aria-hidden="true" />
                          ) : (
                            <ArrowDownIcon className="mr-1 h-3 w-3" aria-hidden="true" />
                          )}
                          R$ {Math.abs(transaction.amount).toFixed(2)}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">{transaction.date}</span>
                      <span className="text-sm text-muted-foreground">{transaction.mainCategory}</span>
                    </div>
                    {transaction.type === 'creditCard' && (
                      <div className="text-sm text-muted-foreground">
                        Pagamento: {transaction.paymentDate}
                      </div>
                    )}
                  </div>
                ))}
              </ScrollArea>
            </TabsContent>
            <TabsContent value="charts">
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Saldo ao Longo do Tempo</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={{
                        balance: {
                          label: "Saldo Efetivado",
                          color: "hsl(var(--chart-1))",
                        },
                        balanceWithPending: {
                          label: "Saldo com Pendentes",
                          color: "hsl(var(--chart-2))",
                        },
                        balanceWithCreditCard: {
                          label: "Saldo com Cartão de Crédito",
                          color: "hsl(var(--chart-3))",
                        },
                      }}
                      className="h-[300px]"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={prepareChartData(selectedWallet.transactions)}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Legend />
                          <Line type="monotone" dataKey="balance" stroke="var(--color-balance)" name="Saldo Efetivado" />
                          <Line type="monotone" dataKey="balanceWithPending" stroke="var(--color-balanceWithPending)" name="Saldo com Pendentes" strokeDasharray="5 5" />
                          <Line type="monotone" dataKey="balanceWithCreditCard" stroke="var(--color-balanceWithCreditCard)" name="Saldo com Cartão de Crédito" strokeDasharray="3 3" />
                        </LineChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Transações por Categoria</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={{
                        efetivado: {
                          label: "Efetivado",
                          color: "hsl(var(--chart-1))",
                        },
                        pendente: {
                          label: "Pendente",
                          color: "hsl(var(--chart-2))",
                        },
                        creditCard: {
                          label: "Cartão de Crédito",
                          color: "hsl(var(--chart-3))",
                        },
                      }}
                      className="h-[300px]"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={prepareCategoryData(selectedWallet.transactions)}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="category" />
                          <YAxis />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Legend />
                          <Bar dataKey="efetivado" stackId="a" fill="var(--color-efetivado)" name="Efetivado" />
                          <Bar dataKey="pendente" stackId="a" fill="var(--color-pendente)" name="Pendente" />
                          <Bar dataKey="creditCard" stackId="a" fill="var(--color-creditCard)" name="Cartão de Crédito" />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="50-30-20">
              <Card>
                <CardHeader>
                  <CardTitle>Distribuição 50-30-20</CardTitle>
                  <CardDescription>Análise de gastos baseada na regra 50-30-20</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      percentage: {
                        label: "Porcentagem",
                        color: "hsl(var(--chart-1))",
                      },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={prepareMainCategoryData(selectedWallet.transactions)}
                          dataKey="total"
                          nameKey="category"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          label={({ category, percentage }) => `${category}: ${percentage}%`}
                        >
                          {prepareMainCategoryData(selectedWallet.transactions).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[entry.category as MainCategory]} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                  <div className="mt-4">
                    <h4 className="font-semibold mb-2">Detalhes:</h4>
                    {prepareMainCategoryData(selectedWallet.transactions).map((category) => (
                      <div key={category.category} className="flex justify-between items-center mb-2">
                        <span>{category.category}</span>
                        <div>
                          <span className="mr-2">Efetivado: R$ {category.efetivado.toFixed(2)}</span>
                          <span className="mr-2">Pendente: R$ {category.pendente.toFixed(2)}</span>
                          <span>Cartão de Crédito: R$ {category.creditCard.toFixed(2)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="users">
              <Card>
                <CardHeader>
                  <CardTitle>Usuários da Carteira</CardTitle>
                  <CardDescription>Distribuição e saldos por usuário</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {selectedWallet.users.map((user) => (
                      <div key={user.id} className="flex justify-between items-center p-2 bg-muted rounded-lg">
                        <div>
                          <h4 className="font-semibold">{user.name}</h4>
                          <p className="text-sm text-muted-foreground">Participação: {user.percentage}%</p>
                        </div>
                        <div className="text-right">
                          <p>Saldo: R$ {calculateUserBalance(user, selectedWallet.transactions)}</p>
                          <p className="text-sm text-muted-foreground">
                            Com pendentes: R$ {calculateUserBalance(user, selectedWallet.transactions, true)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Com cartão de crédito: R$ {calculateUserBalance(user, selectedWallet.transactions, true, true)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Separator className="my-4" />
                  <div>
                    <h4 className="font-semibold mb-2">Análise de Pagamentos</h4>
                    {selectedWallet.users.map((user) => {
                      const userBalance = Number(calculateUserBalance(user, selectedWallet.transactions))
                      const userIdealBalance = Number(calculateBalance(selectedWallet.transactions)) * (user.percentage / 100)
                      const difference = userBalance - userIdealBalance
                      return (
                        <div key={user.id} className="mb-2">
                          <p>{user.name}: 
                            {difference > 0 
                              ? ` Deve receber R$ ${difference.toFixed(2)}`
                              : ` Deve pagar R$ ${Math.abs(difference).toFixed(2)}`
                            }
                          </p>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}