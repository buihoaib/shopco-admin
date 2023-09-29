"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import DataTable from "@/components/dataTable";
import { columns, ProductColumn } from "./columns";

interface ProductClientProps {
    data: ProductColumn[];
}

const ProductClient: React.FC<ProductClientProps> = ({
    data
}) => {

    const router = useRouter();

    return (
        <>
            <div className="flex flex-row justify-between font-semibold text-xl">
                <p>Products</p>
                <div>
                    <Button onClick={() => router.push(`/protected/products/new`)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add new product
                    </Button>
                </div>
            </div >
            <DataTable searchKey="name" columns={columns} data={data} />
        </>
    )
}

export default ProductClient;