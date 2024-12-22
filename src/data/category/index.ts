import { prisma } from "@/services/database";
import { Prisma, Category, CategoryType, Configuration } from "@prisma/client";

export type CategoryFilters = {
  id?: number;
  categoryId?: number;
  name?: string;
  type?: CategoryType;
};

export type CategoryGetPayloadType = Prisma.CategoryGetPayload<{
  include: {
    subcategories: true;
    configurations: true;
    category: {
      select: {
        id: true;
        name: true;
      }
    }
  }
}>

export const getAllCategories = async (filters: CategoryFilters): Promise<{ data: CategoryGetPayloadType[], messageError?: string }> => {
  try {
    const data = await prisma.category.findMany({
      where: {
        ...(filters.id && { id: filters.id }),
        ...(filters.categoryId && { categoryId: filters.categoryId }),
        ...(filters.name && { name: { contains: filters.name } }),
        ...(filters.type && { type: filters.type }),
      },
      include: {
        subcategories: true,
        configurations: true,
        category: {
          select: {
            id: true,
            name: true,
          }
        }
      },
      orderBy: {
        id: 'desc',
      }
    });
    return { data }
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
}

export const getCategoryById = async (id: number): Promise<{ data: CategoryGetPayloadType | null, messageError?: string }> => {
  try {
    const data = await prisma.category.findUnique({
      where: {
        id,
      },
      include: {
        subcategories: true,
        configurations: true,
        category: {
          select: {
            id: true,
            name: true,
          }
        }
      },
    });

    return { data };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      const messageError = error.code;
      return { data: null, messageError };
    }
    if (error instanceof Error) {
      const messageError = error.message;
      return { data: null, messageError };
    }
  }
  return { data: null, messageError: "Unknown error or no data found" };
};

export const createCategory = async (category: Prisma.CategoryCreateInput): Promise<{ data: Category | null, messageError?: string }> => {
  try {
    const data = await prisma.category.create({
      data: category,
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

export const updateCategoryById = async (id: number, category: Prisma.CategoryUpdateInput): Promise<{ data: Category | null, messageError?: string }> => {
  try {
    const data = await prisma.category.update({
      where: {
        id,
      },
      data: category,
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

export const deleteCategoryById = async (id: number): Promise<{ data: Category | null, messageError?: string }> => {
  try {
    const data = await prisma.category.delete({
      where: {
        id,
      },
    });
    return { data }
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      const messageError = error.code + error.message
      return { data: null, messageError }
    }
    if (error instanceof Error) {
      const messageError = error.message
      return { data: null, messageError }
    }
  }
  return { data: null, messageError: "Unknown error or no data found" };
};