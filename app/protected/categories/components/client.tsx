"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import DataTable from "@/components/dataTable";
import { columns, CategoryColumn } from "./columns";

interface CategoriesClientProps {
    data: CategoryColumn[];
}

const CategoriesClient: React.FC<CategoriesClientProps> = ({
    data
}) => {

    const router = useRouter();

    return (
        <>
            <div className="flex flex-row justify-between font-semibold text-xl">
                <p>Categories</p>
                <div>
                    <Button onClick={() => router.push(`/protected/categories/new`)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add new category
                    </Button>
                </div>
            </div >
            <DataTable searchKey="name" columns={columns} data={data} />
        </>
    )
}

export default CategoriesClient;