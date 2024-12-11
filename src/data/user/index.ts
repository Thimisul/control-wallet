import { prisma } from "@/services/database";
import { Prisma, User } from "@prisma/client";

export type UserFilters = {
  id?: string;
  name?: string;
  email?: string;
};

export type UserGetPayloadType = Prisma.UserGetPayload<{
  select: {
    id: true;
    name: true;
    email: true;
    image: true;
  };
}>;


export const getAllUsers = async (filters: UserFilters): Promise<{data: UserGetPayloadType[], messageError?: string}> => {
  try {
  const data = await prisma.user.findMany({
    where: {
      ...(filters.id && { id: filters.id }),
      ...(filters.name && { name: { contains: filters.name } }),
      ...(filters.email && { email: { contains: filters.email } }),
    },
  });
  return {data};
}catch(error){
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    console.log(error.code)
    const messageError = error.code
    return {data: [], messageError}
  }
  if (error instanceof Error) {
    console.error(error.message)
    const messageError = error.message
    return {data: [], messageError}
  }
}
return { data: [], messageError: "Unknown error or no data found" };
};  

export const getUserById = async (id: string): Promise<{data: UserGetPayloadType | null, messageError?: string}> => {
  try{
  const data = await prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
    },
  });
  return {data};
}catch(error){
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

export const createUser = async (user: Prisma.UserCreateInput): Promise<{data: UserGetPayloadType | null, messageError?: string}> => {
  try{
  const data = await prisma.user.create({
    data: user,
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
    },
  });
  return {data};
}catch(error){
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    console.log(error.code)
    const messageError = error.code
    return { data: null, messageError };  }
  if (error instanceof Error) {
    console.error(error.message)
    const messageError = error.message
    return { data: null, messageError }; null
  }
}
return { data: null, messageError: "Unknown error or no data found" };
};

export const updateUserById = async (id: string, user: Partial<Prisma.UserUpdateInput>): Promise<{data: UserGetPayloadType | null, messageError?: string}> => {
  try{
  const data = await prisma.user.update({
    where: {
      id,
    },
    data: user,
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
    },
  });
  return {data};
}catch(error){
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

export const deleteUserById = async (id: string): Promise<{data: UserGetPayloadType | null, messageError?: string}> => {
  try{
  const data = await prisma.user.delete({
    where: {
      id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
    },
  });
  return {data};
}catch(error){
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