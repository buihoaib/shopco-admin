import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";

export async function GET(
    req: Request,
    { params }: { params: { productId: string } }
) {
    try {
        if (!params.productId) {
            return new NextResponse("Product id is required", { status: 400 });
        }

        const product = await prisma.product.findUnique({
            where: {
                id: params.productId
            },
            include: {
                images: true,
                category: true,
                sizes: true
            }
        });

        return NextResponse.json(product);
    } catch (error) {
        console.log('[PRODUCT_GET]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
};

export async function DELETE(
    req: Request,
    { params }: { params: { productId: string } }
) {
    try {

        if (!params.productId) {
            return new NextResponse("Product id is required", { status: 400 });
        }

        const product = await prisma.product.delete({
            where: {
                id: params.productId,
            }
        });

        return NextResponse.json(product);
    } catch (error) {
        console.log('[PRODUCT_DELETE]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
};


export async function PATCH(
    req: Request,
    { params }: { params: { productId: string } }
) {
    try {
        const body = await req.json();

        const {
            name,
            price,
            categoryId,
            images,
            sizes
        } = body;

        if (!params.productId) {
            return new NextResponse("Product id is required", { status: 400 });
        }

        if (!name) {
            return new NextResponse("Name is required", { status: 400 });
        }

        if (!price) {
            return new NextResponse("Price is required", { status: 400 });
        }

        if (!images) {
            return new NextResponse("Image is required", { status: 400 });
        }

        if (!categoryId) {
            return new NextResponse("Category id is required", { status: 400 });
        }

        if (!sizes) {
            return new NextResponse("Size is required", { status: 400 });
        }

        await prisma.product.update({
            where: {
                id: params.productId
            },
            data: {
                name,
                price,
                categoryId,
                images: {
                    deleteMany: {},
                },
                sizes: {
                    deleteMany: {},
                },
            },
        });

        const product = await prisma.product.update({
            where: {
                id: params.productId,
            },
            data: {
                images: {
                    createMany: {
                        data: [
                            ...images.map((image: {
                                url: string
                            }) => image),
                        ],
                    },
                },
                sizes: {
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
        console.log('[PRODUCT_PATCH]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
};
