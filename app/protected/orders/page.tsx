import { format } from "date-fns";

import prisma from "@/lib/prisma";
import { formatter } from "@/lib/utils";

import { OrderColumn } from "./components/columns"
import OrderClient from "./components/client";

export const revalidate = 0;

const OrdersPage = async ({
}) => {
    const orders = await prisma.order.findMany({
        include: {
            orderItems: {
                include: {
                    product: true
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    const formattedOrders: OrderColumn[] = orders.map((item) => ({
        id: item.id,
        phone: item.phone,
        address: item.address,
        products: item.orderItems.map((orderItem) => `${orderItem.product.name}, size ${orderItem.size};`).join('\n'),
        totalPrice: formatter.format(item.orderItems.reduce((total, item) => {
            return total + (Number(item.product.price) * item.quantity)
        }, 0)),
        isPaid: item.isPaid,
        createdAt: format(item.createdAt, 'MMMM do, yyyy'),
    }));

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <OrderClient data={formattedOrders} />
            </div>
        </div>
    );
};

export default OrdersPage;
