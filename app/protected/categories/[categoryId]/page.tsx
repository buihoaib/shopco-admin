import prisma from "@/lib/prisma";
import CategoryForm from "@/components/categoryForm";

export const revalidate = 0;

export default async function CategoryPage({
    params,
}: {
    params: { categoryId: string }
}) {
    const category = params.categoryId === 'new' ? null :
        await prisma.category.findUnique({
            where: {
                id: params.categoryId
            }
        });

    return (
        <div className="flex flex-col">
            <CategoryForm initialData={category} />
        </div>
    )
}