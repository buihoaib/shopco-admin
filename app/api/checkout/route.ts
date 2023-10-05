import Stripe from "stripe";
import { NextResponse } from "next/server";

import { stripe } from "@/lib/stripe";
import prismadb from "@/lib/prisma";

interface ClientOrderItems {
  productId: string;
  size: string;
  quantity: number;
}

export const revalidate = 0;

const corsHeaders = {
  "Access-Control-Allow-Credentials": "true",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization"
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(
  req: Request,
) {
  const {
    clientOrderItems
  } = await req.json();

  if (!clientOrderItems || clientOrderItems.length === 0) {
    return new NextResponse("Client's order items are required", { status: 400 });
  }

  const productIds = clientOrderItems.map((item: any) => item.productId);
  const products = await prismadb.product.findMany({
    where: {
      id: {
        in: productIds
      }
    }
  });

  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

  clientOrderItems.forEach((item: any, index: number) => {
    const currentProduct = products.find((product) => product.id = item.productId)!

    const productName = `${currentProduct.name}-size-${item.size}`

    line_items.push({
      quantity: item.quantity,
      price_data: {
        currency: 'USD',
        product_data: {
          name: productName
        },
        unit_amount: Math.round(currentProduct.price * 100)
      }
    });
  });

  const order = await prismadb.order.create({
    data: {
      isPaid: false,
      orderItems: {
        create: productIds.map((productId: string, index: number) => ({
          product: {
            connect: {
              id: productId
            }
          },
          size: clientOrderItems[index].size,
          quantity: clientOrderItems[index].quantity,
        }))
      }
    }
  });

  const session = await stripe.checkout.sessions.create({
    line_items,
    mode: 'payment',
    billing_address_collection: 'required',
    phone_number_collection: {
      enabled: true,
    },
    success_url: `${process.env.FRONTEND_STORE_URL}/cart?success=1`,
    cancel_url: `${process.env.FRONTEND_STORE_URL}/cart?canceled=1`,
    metadata: {
      orderId: order.id
    },
  });

  return NextResponse.json({ url: session.url }, {
    headers: corsHeaders
  });
};
