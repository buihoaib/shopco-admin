import { CreditCard, DollarSign, Package } from "lucide-react";
import { formatter } from "@/lib/utils";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { getTotalRevenue } from "@/actions/getTotalRevenue";
import { getTotalSales } from "@/actions/getTotalSales";
import { getTotalStocks } from "@/actions/getTotalStocks";


export default async function Dashboard() {
    const totalRevenue = await getTotalRevenue();
    const totalSales = await getTotalSales();
    const totalStocks = await getTotalStocks();

    return (
        <div>
            <p className="font-semibold text-xl">Dashboard</p>
            <div className="grid gap-4 grid-cols-3 my-5">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Revenue
                        </CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatter.format(totalRevenue)}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Sales
                        </CardTitle>
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{`+${totalSales}`}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Stocks
                        </CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalStocks}</div>
                    </CardContent>
                </Card>
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <OverviewGraph data={graphRevenue} />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
