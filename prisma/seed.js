const { PrismaClient, CategoryType } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {

    const manyCategories = await prisma.category.createMany({
        data: [
            { id: 1, name: "Tranferência", type: CategoryType.BOTH },
            { id: 2, name: "Necessidades", type: CategoryType.EXIT },
            { id: 3, name: "Investimento", type: CategoryType.EXIT },
            { id: 4, name: "Entreterimento", type: CategoryType.EXIT },
            { id: 5, name: "Desejos Pessoais", type: CategoryType.EXIT },
        ]
    })
    console.log({ manyCategories })

}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })