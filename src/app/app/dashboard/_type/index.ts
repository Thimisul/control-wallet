export type CategoryType = 'EXIT' | 'ENTRANCE' | 'BOTH';

export interface User {
  id: string;
  name: string;
}

export interface Category {
  id: number;
  name: string;
  type: CategoryType;
}

export interface Operation {
  owner: User;
  date: string;
  value: string;
  observation: string;
  category: Category;
}

export interface ExitOperation extends Operation {
  statusExit: boolean;
  statusOperation: boolean;
  paymentDate: string | null;
}

export interface Wallet {
  id: number;
  name: string;
  owner: User;
  entrance_operations: Operation[];
  exit_operations: ExitOperation[];
  subWallets: Wallet[];
}

// Tipos para os dados processados
export interface CategoryDistribution {
  name: string;
  value: number;
}

export interface CashFlow {
  date: string;
  entrada: number;
  saída: number;
  category: string;
}

export interface WalletComparison {
  name: string;
  valor: number;
}

export interface CreditCardSpending {
  date: string;
  valor: number;
}

export interface ProcessedWalletData {
  categoryDistribution: CategoryDistribution[];
  cashFlow: CashFlow[];
}

export interface WalletStatusData {
  date: string;
  pendingValue: number;
  completedValue: number;
}