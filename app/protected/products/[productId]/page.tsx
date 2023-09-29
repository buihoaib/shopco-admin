import prisma from "@/lib/prisma";
import ProductForm from "@/components/productForm";

export default async function ProductPage({
    params,
}: {
    params: { productId: string }
}) {
    const product = params.productId === 'new' ? null :
        await prisma.product.findUnique({
            where: {
                id: params.productId
            },
            include: {
                images: true,
                category: true,
                sizes: true
            },
        });

    const categories = await prisma.category.findMany();

    return (
        <div className="flex flex-col">
            <ProductForm
                initialData={product}
                categories={categories}
            />
        </div>
    )
}