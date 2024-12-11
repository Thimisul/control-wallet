import { prisma } from "@/services/database";
import { Operation, Prisma } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export type OperationFilters = {
  id?: number;
  startDate?: Date;
  endDate?: Date;
  categoryId?: number;
  observation?: string;
  statusEntrance?: boolean;
  statusExit?: boolean;
  statusOperation?: boolean;
  entranceWalletId?: number;
  exitWalletId?: number;
  ownerId?: string;
};

export type OperationGetPayloadType = Prisma.OperationGetPayload<{
  include: {
    category: { select: { id: true; name: true; type: true } };
    entranceWallet: { select: { id: true; name: true } };
    exitWallet: { select: { id: true; name: true } };
    owner: { select: { id: true; name: true } };
  };
}>  & {
  value: Decimal | number | string | null;
};

export const getAllOperations = async (filters: OperationFilters): Promise<{ data: OperationGetPayloadType[], messageError?: string }> => {
  const { startDate, endDate, ...restFilters } = filters;

  try {
    const data = await prisma.operation.findMany({
      where: {
        ...(filters.id && { id: filters.id }),
        ...(filters.categoryId && { wallet: filters.categoryId }),
        ...(filters.observation && { observation:{ contains: filters.observation } }),
        ...(filters.entranceWalletId && { entranceWalletId: filters.entranceWalletId }),
        ...(filters.exitWalletId && { exitWalletId: filters.exitWalletId }),
        statusEntrance: filters.statusEntrance !== undefined ? filters.statusEntrance : undefined,
        statusExit: filters.statusExit !== undefined ? filters.statusExit : undefined,
        statusOperation: filters.statusOperation !== undefined ? filters.statusOperation : undefined,
        date: {
          ...(startDate && { gte: startDate }),
          ...(endDate && { lte: endDate }),
        },
      },
      include: {
        owner: { select: { id: true, name: true } },
        category: { select: { id: true, name: true, type: true } },
        entranceWallet: { select: { id: true, name: true } },
        exitWallet: { select: { id: true, name: true } },
      }
    });

    return { data };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.log(error.code)
      const messageError = error.code
      return { data: [], messageError }
    }
    if (error instanceof Error) {
      console.error(error.message)
      const messageError = error.message
      return { data: [], messageError }
    }
  }
  return { data: [], messageError: "Unknown error or no data found" };
}

export const getOperationById = async (id: number): Promise<{ data: OperationGetPayloadType | null, messageError?: string }> => {
  try {
    const data = await prisma.operation.findUnique({
      where: {
        id,
      },
      include: {
        owner: { select: { id: true, name: true } },
        category: { select: { id: true, name: true, type: true } },
        entranceWallet: { select: { id: true, name: true } },
        exitWallet: { select: { id: true, name: true } },
      }
    });
    return { data };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.log(error.code)
      const messageError = error.code
      return { data: null, messageError }
    }
    if (error instanceof Error) {
      console.error(error.message)
      const messageError = error.message
      return { data: null, messageError }
    }
  }
  return { data: null, messageError: "Unknown error or no data found" };
};

export const createOperation = async (operation: Prisma.OperationCreateInput): Promise<{data: Operation | null, messageError?: string}> => {
  try{
  const month = format(new Date(operation.date), 'yyyy-MM')
  const data = await prisma.operation.create({
    data: {
      ...operation,
      month: month
    },
  });
  return {data};
}catch (error) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    console.log(error.code)
    const messageError = error.code
    return { data: null, messageError }
  }
  if (error instanceof Error) {
    console.error(error.message)
    const messageError = error.message
    return { data: null, messageError }
  }
}
return { data: null, messageError: "Unknown error or no data found" };
};

export const updateOperationById = async (id: number, operation: Partial<Prisma.OperationUpdateInput>): Promise<{data: Operation | null, messageError?: string}> => {
  try{
  const data = await prisma.operation.update({
    where: {
      id,
    },
    data: operation,
  });
  return {data};
}catch (error) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    console.log(error.code)
    const messageError = error.code
    return { data: null, messageError }
  }
  if (error instanceof Error) {
    console.error(error.message)
    const messageError = error.message
    return { data: null, messageError }
  }
}
return { data: null, messageError: "Unknown error or no data found" };
};

export const deleteOperationById = async (id: number): Promise<{data: Operation | null, messageError?: string}> => {
  try{
  const data = await prisma.operation.delete({
    where: {
      id,
    },
  });
  return {data};
}catch(error){    
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    console.log(error.code)
    const messageError = error.code + error.message
    return { data: null, messageError }
  }
  if (error instanceof Error) {
    console.error(error.message)
    const messageError = error.message
    return { data: null, messageError }
  }
}
return { data: null, messageError: "Unknown error or no data found" };
};

