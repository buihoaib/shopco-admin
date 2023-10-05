import prisma from "@/lib/prisma";
import { format } from "date-fns";

import { CategoryColumn } from "./components/columns";
import CategoriesClient from "./components/client";

export const revalidate = 0;

export default async function CategoriesPage() {
    const categories = await prisma.category.findMany();

    const formattedCategories: CategoryColumn[] = categories.map((item) => ({
        id: item.id,
        name: item.name,
        createdAt: format(item.createdAt!, 'MMMM do, yyyy'),
    }));

    return (
        <div className="flex flex-col">
            <CategoriesClient data={formattedCategories} />
        </div>
    )
}
