"use client"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useForm } from "react-hook-form"
import { Trash } from "lucide-react"
import axios from "axios"
import toast from "react-hot-toast"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { AlertModal } from "@/components/alertModal"
import { Category, Image, Product } from "@prisma/client"
import ImageUpload from "@/components/imageUpload"
import SizeTable from "@/components/sizeTable"

const productFormSchema = z.object({
    name: z.string().min(1),
    // description: z.string().min(1).optional(),
    price: z.coerce.number().min(1),
    categoryId: z.string().min(1),
    images: z.array(
        z.object({
            url: z.string()
        })
    ).min(1),
    sizes: z.array(
        z.object({
            type: z.string(),
            stock: z.number(),
            id: z.string().optional(),
            // updatedAt: z.string().optional(),
        })
    ).min(1)
});

interface ProductFormProps {
    initialData: Product & {
        images: Image[]
    } | null;
    categories: Category[];
    //sizeTypes: SizeType[];
};

const ProductForm: React.FC<ProductFormProps> = ({
    initialData,
    categories,
    //sizeTypes
}) => {
    const params = useParams();
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const title = initialData ? 'Edit product' : 'Create product';
    const toastMessage = initialData ? 'Product updated.' : 'Product created.';
    const action = initialData ? 'Save changes' : 'Create';

    // const defaultSizes = []
    // const addDefaultSizes = () => {
    //     sizeTypes.forEach
    // }

    useEffect(() => {
        console.log('')
    }, [])

    const defaultValues = initialData ? {
        ...initialData,
        price: parseFloat(String(initialData?.price)),
    } : {
        name: '',
        description: '',
        price: 0,
        categoryId: '',
        images: [],
        sizes: [],
    }

    const form = useForm<z.infer<typeof productFormSchema>>({
        resolver: zodResolver(productFormSchema),
        defaultValues
    })

    const onSubmit = async (data: z.infer<typeof productFormSchema>) => {
        try {
            setLoading(true);
            if (initialData) {
                await axios.patch(`/api/products/${params.productId}`, data);
            } else {
                await axios.post(`/api/products`, data);
            }
            router.refresh();
            router.push(`/protected/products`);
            toast.success(toastMessage);
        } catch (error: any) {
            toast.error('Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    const onDelete = async () => {
        try {
            setLoading(true);
            await axios.delete(`/api/products/${params.productId}`);
            router.refresh();
            router.push(`/protected/products`);
            toast.success('Product deleted.');
        } catch (error: any) {
            toast.error('Something went wrong.');
        } finally {
            setLoading(false);
            setOpen(false);
        }
    }

    return (
        <>
            <AlertModal
                isOpen={open}
                onClose={() => setOpen(false)}
                onConfirm={onDelete}
                loading={loading}
            />
            <div className="flex items-center justify-between">
                <p className="text-xl font-semibold">{title}</p>
                {initialData && (
                    <Button
                        disabled={loading}
                        variant="destructive"
                        size="sm"
                        onClick={() => setOpen(true)}
                    >
                        <Trash className="h-4 w-4" />
                    </Button>
                )}
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 py-8">
                    <FormField
                        control={form.control}
                        name="images"
                        render={({ field }) => (field &&
                            <FormItem>
                                <FormLabel>Images</FormLabel>
                                <FormControl>
                                    <ImageUpload
                                        value={(field.value)!.map((image) => image.url)}
                                        disabled={loading}
                                        onChange={(url) => field.onChange([...(field.value)!, { url }])}
                                        onRemove={(url) => field.onChange([...(field.value)!.filter((current) => current.url !== url)])}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="md:grid md:grid-cols-3 gap-8">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Product name"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Price</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            disabled={loading}
                                            placeholder="9.99" {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="categoryId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category</FormLabel>
                                    <Select
                                        disabled={loading}
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue defaultValue={field.value} placeholder="Select a category" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {categories.map((category) => (
                                                <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormField
                        control={form.control}
                        name="sizes"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Sizes</FormLabel>
                                <FormControl>
                                    <SizeTable
                                        value={(field.value)!.map((size) => size)}
                                        disabled={loading}
                                        onChange={
                                            (type: string, stock: number) => field.onChange([...(field.value)!, { type, stock }])
                                        }
                                        onRemove={
                                            (type: string) => field.onChange([...(field.value)!.filter((current) => current.type !== type)])
                                        }
                                        onEdit={
                                            (type: string, stock: number, oldType: string) => {
                                                const index = field.value.findIndex((current) => current.type === oldType)
                                                field.value[index] = { type, stock };
                                                field.onChange([...(field.value)]);
                                            }
                                        }
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button disabled={loading} className="ml-auto" type="submit">
                        {action}
                    </Button>
                </form>
            </Form>
        </>
    )
}

export default ProductForm;