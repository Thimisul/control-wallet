import { prisma } from "@/services/database";
import { Configuration, Operation, Prisma } from "@prisma/client";

export type ConfigurationFilters = {
  id?: number;
  ownerId?: string;
};

export type ConfigurationGetPayloadType = Prisma.ConfigurationGetPayload<{
  select: {
    configurationCategory: {
      select: {
        percentage: true;
        category: {
          select: {
            id: true;
            name: true;
          }
        }
      }
    }
  }
}>

export const getAllConfigurations = async (filters: ConfigurationFilters): Promise<{
  data: ConfigurationGetPayloadType[], messageError?: string
}> => {
  try {
    const data = await prisma.configuration.findMany({
      where: {
        ...(filters.id && { id: filters.id }),
        ...(filters.ownerId && { ownerId: filters.ownerId })
      },
      select: {
        configurationCategory: {
          select: {
            percentage: true,
            category: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
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


export const getConfigurationById = async (id: number): Promise<{data: ConfigurationGetPayloadType | null, messageError?: string }> => {
  try {
    const data = await prisma.configuration.findUnique({
      where: {
        id,
      },
      select: {
        configurationCategory: {
          select: {
            percentage: true,
            category: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
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
}

export const createConfiguration = async (configuration: Prisma.ConfigurationCreateInput): Promise<{data: Configuration | null, messageError?: string}> => {
  try {
    const data = await prisma.configuration.create({
      data: configuration,
    });
    return {data} ;
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

export const updateConfigurationById = async (id: number, configuration: Prisma.ConfigurationUpdateInput): Promise<{data: Configuration | null, messageError?: string}> => {
  try{
  const data = await prisma.configuration.update({
    where: {
      id,
    },
    data: configuration,
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


  export const deleteConfigurationById = async (id: number): Promise<{data: Configuration | null, messageError?: string}> => {
    try {
      const data = await prisma.configuration.delete({
        where: {
          id,
        },
      });
      return { data }
    } catch (error) {
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