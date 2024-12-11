import { WalletFilters, getAllWallets } from "@/data/wallets";

export const getWalletsDashboardAction = async (filters: WalletFilters) => {
  const allWallets = await getAllWallets(filters)
  const allWalletsList = allWallets.data.map((wallet: any) => {
    return {
      id: wallet.id,
      name: wallet.name,
      owner: {
        id: wallet.owner.id,
        name: wallet.owner.name,
      },
      entrance_operations: wallet.entrance_operations,
      exit_operations: wallet.exit_operations, 
      sumOperationsWallet: sumOperationsWallet(wallet.entrance_operations, wallet.exit_operations),
      participants: wallet.participants,
    }
  })
  return allWalletsList
}

const sumOperationsWallet = (entrance:{value: string, statusOperation: boolean}[], exit:{value: string, statusOperation: boolean}[]) => {

    const operationsEntrancePendent = entrance?.filter(operation => operation.statusOperation === false)
        .reduce((soma: number, o: {value: string, statusOperation: boolean}) => 
          soma + Number(o.value), 0)
    
     const operationsEntranceCompleted = entrance?.filter(operation => operation.statusOperation === true)
        .reduce((soma: number, o: {value: string, statusOperation: boolean}) => 
          soma + Number(o.value), 0)

     const operationsExitsPendent = exit?.filter(operation => operation.statusOperation === false)
        .reduce((soma: number, o: {value: string, statusOperation: boolean}) => 
          soma + Number(o.value), 0)

     const operationsExitsCompleted = exit.filter(operation => operation.statusOperation === true)
        .reduce((soma: number, o: {value: string, statusOperation: boolean}) => 
          soma + Number(o.value), 0)
  
  return {
    operationsEntrancePendent,
    operationsEntranceCompleted,
    operationsEntranceTotal: operationsEntrancePendent + operationsEntranceCompleted,
    operationsExitsPendent,
    operationsExitsCompleted,
    operationsExitsTotal: operationsExitsPendent + operationsExitsCompleted,
    operationsPendentTotal: operationsEntrancePendent - operationsExitsPendent,
    operationsCompletedTotal: operationsEntranceCompleted - operationsExitsCompleted,
    operationsTotal: operationsEntrancePendent + operationsEntranceCompleted - operationsExitsPendent - operationsExitsCompleted,
    
  }
}
