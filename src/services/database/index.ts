import { PrismaClient } from "@prisma/client"


export const prisma = new PrismaClient({
  log: [
    {
      emit: 'event',
      level: 'query',
    },
    {
      emit: 'stdout',
      level: 'error',
    },
    {
      emit: 'stdout',
      level: 'info',
    },
    {
      emit: 'stdout',
      level: 'warn',
    },
  ],
}).$extends({
  query: {
    operation: {
      async findMany({ args, query }) {
        const result = await query(args);
        return result.map((entry) => ({
          ...entry,
          value: entry.value?.toString?.() ?? entry.value,
        }));
      },
    },
  },
});
