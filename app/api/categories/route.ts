import { NextResponse } from 'next/server';

import prisma from "@/lib/prisma";

interface RequestBody {
    name: string
}

export async function POST(request: Request) {
    try {
        const body: RequestBody = await request.json();

        const {
            name
        } = body;

        const category = await prisma.category.create({
            data: {
                name
            },
        });

        return NextResponse.json(category);
    } catch (error) {
        console.log('[CATEGORIES_POST]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
}

// GET all categories
export async function GET(request: Request) {
    try {
        const categories = await prisma.category.findMany();

        return NextResponse.json(categories);
    } catch (error) {
        console.log('[CATEGORIES_GET_ALL]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
}