import Stripe from "stripe"
import { headers } from "next/headers"
import { NextResponse } from "next/server"

import { stripe } from "@/lib/stripe"
import prisma from "@/lib/prisma"

export async function POST(req: Request) {
    const body = await req.text()
    const signature = headers().get("Stripe-Signature") as string

    let event: Stripe.Event

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        )
    } catch (error: any) {
        return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 })
    }

    const session = event.data.object as Stripe.Checkout.Session;
    const address = session?.customer_details?.address;

    const addressComponents = [
        address?.line1,
        address?.line2,
        address?.city,
        address?.state,
        address?.postal_code,
        address?.country
    ];

    const addressString = addressComponents.filter((c) => c !== null).join(', ');


    if (event.type === "checkout.session.completed") {
        const order = await prisma.order.update({
            where: {
                id: session?.metadata?.orderId,
            },
            data: {
                isPaid: true,
                address: addressString,
                phone: session?.customer_details?.phone || '',
            },
            include: {
                orderItems: {
                    include: {
                        product: {
                            include: {
                                sizes: true
                            }
                        }
                    }
                },
            }
        });

        // Reduce stocks for purchased products
        for (const orderItem of order.orderItems) {
            // Record sizes and update calculations
            const currentProduct = await prisma.product.findUnique({
                where: {
                    id: orderItem.productId
                },
                include: {
                    sizes: true
                }
            });
            const currentSizes = currentProduct!.sizes;

            // Create new sizes to update product with
            const newSizes: any = [];
            currentSizes.forEach((size) => {
                if (size.type === orderItem.size) {
                    newSizes.push({ type: size.type, stock: (size.stock - orderItem.quantity) });
                } else {
                    newSizes.push({ type: size.type, stock: size.stock });
                }
            });

            // Delete old sizes
            await prisma.product.update({
                where: {
                    id: orderItem.productId,
                },
                data: {
                    sizes: {
                        deleteMany: {},
                    }
                },
            });

            // Update with new quality
            await prisma.product.update({
                where: {
                    id: orderItem.productId,
                },
                data: {
                    sizes: {
                        createMany: {
                            data: [
                                ...newSizes.map((size: {
                                    type: string,
                                    stock: number
                                }) => size),
                            ],
                        },
                    }
                },
            });
        }
    }

    return new NextResponse(null, { status: 200 });
};
