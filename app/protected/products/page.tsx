import prisma from "@/lib/prisma";
import { format } from "date-fns";

import ProductClient from "./components/client";

export default async function ProductsPage() {
    const products = await prisma.product.findMany({
        include: {
            images: true,
            category: true,
            sizes: true
        },
    });

    const formattedProducts = products.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        category: item.category.name,
        createdAt: format(item.createdAt!, 'MMMM do, yyyy'),
    }));

    return (
        <div className="flex flex-col">
            <ProductClient data={formattedProducts} />
        </div>
    )
}
