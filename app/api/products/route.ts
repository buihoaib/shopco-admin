import { NextResponse } from 'next/server';

import prisma from "@/lib/prisma";

interface RequestBody {
  name: string,
  description?: string,
  price: number,
  categoryId: string,
  images?: any[],
  sizes?: any[],
}

export async function POST(request: Request) {
  try {
    const body: RequestBody = await request.json();

    const {
      name,
      description,
      price,
      categoryId,
      images,
      sizes
    } = body;

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        categoryId,
        images: images && {
          createMany: {
            data: [
              ...images.map((image: {
                url: string,
              }) => image),
            ],
          },
        },
        sizes: sizes && {
          createMany: {
            data: [
              ...sizes.map((size: {
                type: string,
                stock: number
              }) => size),
            ],
          },
        },
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log('[PRODUCTS_POST]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// GET all products
export async function GET(
  request: Request,
) {
  const { searchParams } = new URL(request.url)
  const categoryId = searchParams.get('categoryId') || undefined;
  const isFeatured = searchParams.get('isFeatured');

  try {
    const products = await prisma.product.findMany({
      where: {
        categoryId,
        isFeatured: isFeatured ? true : undefined,
      },
      include: {
        images: true,
        category: true,
        sizes: true
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.log('[PRODUCTS_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}