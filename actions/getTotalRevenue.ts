import prisma from "@/lib/prisma";

export const getTotalRevenue = async () => {
    const paidOrders = await prisma.order.findMany({
        where: {
            isPaid: true
        },
        include: {
            orderItems: {
                include: {
                    product: true
                }
            }
        }
    });

    const totalRevenue = paidOrders.reduce((total, order) => {
        const orderTotal = order.orderItems.reduce((orderSum, item) => {
            return orderSum + item.product.price;
        }, 0);
        return total + orderTotal;
    }, 0);

    return totalRevenue;
};
