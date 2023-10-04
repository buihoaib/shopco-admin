import prisma from "@/lib/prisma";

export const getTotalStocks = async () => {
    const products = await prisma.product.findMany({
        include: {
            sizes: true
        }
    });

    const totalStocks = products.reduce((total, product) => {
        const productTotalStock = product.sizes.reduce((stockSum, size) => {
            return stockSum + size.stock;
        }, 0);
        return total + productTotalStock;
    }, 0);

    return totalStocks;
};
