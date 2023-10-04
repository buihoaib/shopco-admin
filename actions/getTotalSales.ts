import prisma from "@/lib/prisma";

export const getTotalSales = async () => {
    const totalSales = await prisma.order.count({
        where: {
            isPaid: true
        }
    });

    return totalSales;
};
