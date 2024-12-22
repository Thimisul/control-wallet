import { prisma } from "@/services/database";
import { Participant, Prisma, Wallet } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { ca } from "date-fns/locale";

export type WalletFilters = {
  id?: number;
  ownerId?: string;
  name?: string;
  initialValue?: number;
  isVisible?: boolean;
  walletId?: number | null;
};

interface ParticipantInput {
  participantId: string;
  percentage: number;
}

export type WalletGetPayloadType = Prisma.WalletGetPayload<{
  select: {
    id: true,
    name: true,
    isVisible: true,
    participants: {
      select: {
        percentage: true,
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        wallet: {
          select: {
            id: true,
            name: true,
          },
        },
      }
    },
    owner: {
      select: {
        id: true,
        name: true,
      }
    },
    subWallets: {
      select: {
        id: true,
        name: true,
        isVisible: true,
      }
    },
    wallet: {
      select: {
        id: true,
        name: true,
      }
    },
  }
}> & {
  initialValue: Decimal | number | string | null;
};


export const getAllWallets = async (filters: WalletFilters): Promise<{ data: WalletGetPayloadType[], messageError?: string }> => {
  try {
    const data = await prisma.wallet.findMany({
      where: {
        ...(filters.id && { id: filters.id }),
        ...(filters.name && { name: { contains: filters.name } }),
        ...(filters.isVisible && { isVisible: filters.isVisible }),
        ...(filters.ownerId && { ownerId: filters.ownerId }),
        ...(filters.walletId && { walletId: filters.walletId }),
        ...(filters.walletId === null && { wallet: null }),
      },
      select: {
        id: true,
        name: true,
        initialValue: true,
        isVisible: true,
        participants: {
          select: {
            percentage: true,
            user: {
              select: {
                id: true,
                name: true
              }
            },
            wallet: {
              select: {
                id: true,
                name: true,
              },
            },
          }
        },
        owner: {
          select: {
            id: true,
            name: true
          }
        },
        subWallets: {
          select: {
            id: true,
            name: true,
            isVisible: true,
          }
        },
        wallet: {
          select: {
            id: true,
            name: true,
          }
        },
      }
    });
    return { data };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      const messageError = error.code
      return { data: [], messageError }
    }
    if (error instanceof Error) {
      const messageError = error.message
      return { data: [], messageError }
    }
  }
  return { data: [], messageError: "Unknown error or no data found" };
};

export const createWallet = async (wallet: Prisma.WalletCreateManyInput): Promise<{ data: WalletGetPayloadType | null, messageError?: string }> => {
  try {
    const data = await prisma.wallet.create({
      data: wallet,
      select: {
        id: true,
        name: true,
        initialValue: true,
        isVisible: true,
        participants: {
          select: {
            percentage: true,
            user: {
              select: {
                id: true,
                name: true
              }
            },
            wallet: {
              select: {
                id: true,
                name: true,
              },
            },
          }
        },
        owner: {
          select: {
            id: true,
            name: true
          }
        },
        subWallets: {
          select: {
            id: true,
            name: true,
            isVisible: true,
          }
        },
        wallet: {
          select: {
            id: true,
            name: true,
          }
        },
      }
    });
    return { data };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      const messageError = error.code
      return { data: null, messageError }
    }
    if (error instanceof Error) {
      const messageError = error.message
      return { data: null, messageError }
    }
  }
  return { data: null, messageError: "Unknown error or no data found" };
};

export const deleteWalletById = async (id: number): Promise<{ data: [Prisma.BatchPayload, Wallet] | null, messageError?: string }> => {
  try {
    const data = await prisma.$transaction([
      prisma.participant.deleteMany({
        where: {
          walletId: id
        }
      }),
      prisma.wallet.delete({
        where: {
          id,
        },
      }),
    ],)
    return { data };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      const messageError = error.code
      return { data: null, messageError }
    }
    if (error instanceof Error) {
      const messageError = error.message
      return { data: null, messageError }
    }
  }
  return { data: null, messageError: "Unknown error or no data found" };
};

export const getWalletById = async (id: number): Promise<{ data: WalletGetPayloadType | null, messageError?: string }> => {
  try {
    const data = await prisma.wallet.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        initialValue: true,
        isVisible: true,
        participants: {
          select: {
            percentage: true,
            user: {
              select: {
                id: true,
                name: true
              }
            },
            wallet: {
                select: {
                    id: true,
                    name: true,
                },
            }
          }
        },
        owner: {
          select: {
            id: true,
            name: true
          }
        },
        subWallets: {
          select: {
            id: true,
            name: true,
            isVisible: true,
          }
        },
        wallet: {
          select: {
            id: true,
            name: true,
          }
        },
      }
    });
    return { data};
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      const messageError = error.code
      return { data: null, messageError }
    }
    if (error instanceof Error) {
      const messageError = error.message
      return { data: null, messageError }
    }
  }
  return { data: null, messageError: "Unknown error or no data found" };
}

export const updateWalletById = async (
  id: number,
  wallet: Prisma.WalletUpdateManyMutationInput,
  participants : ParticipantInput[]
): Promise<{ data: WalletGetPayloadType | null, messageError?: string }> => 
  {
  try {
    const data = await prisma.wallet.update({
        where: {
          id,
        },
        data: {
          ...wallet,
          participants: {
            deleteMany: {},
            create: participants.map(participant => ({
              participantId: participant.participantId,
              percentage: participant.percentage,
            })),
          },
        },
        select: {
          id: true,
          name: true,
          initialValue: true,
          isVisible: true,
          participants: {
            select: {
              percentage: true,
              user: {
                select: {
                  id: true,
                  name: true
                }
              },
              wallet: {
                select: {
                  id: true,
                  name: true,
                },
              },
            }
          },
          owner: {
            select: {
              id: true,
              name: true
            }
          },
          subWallets: {
            select: {
              id: true,
              name: true,
              isVisible: true,
            }
          },
          wallet: {
            select: {
              id: true,
              name: true,
            }
          },
        }
      })
    return { data };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      const messageError = error.code
      return { data: null, messageError }
    }
    if (error instanceof Error) {
      const messageError = error.message
      return { data: null, messageError }
    }
  }
  return { data: null, messageError: "Unknown error or no data found" };
};
