import DataTable from "@/components/dataTable";
import { columns, OrderColumn } from "./columns";

interface OrderClientProps {
    data: OrderColumn[];
}

const OrderClient: React.FC<OrderClientProps> = ({
    data
}) => {
    return (
        <>
            <div className="flex flex-row justify-between font-semibold text-xl">
                <p>Orders ({data.length})</p>
            </div >
            <DataTable searchKey="products" columns={columns} data={data} />
        </>
    )
}

export default OrderClient;