"use client"
import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useForm } from "react-hook-form"
import axios from "axios"
import toast from "react-hot-toast"
import { Trash } from "lucide-react"

import { Button } from "@/components/ui/button"
import { AlertModal } from "@/components/alertModal"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Category, Image, Product } from "@prisma/client"
import ImageUpload from "@/components/imageUpload"

const categoryFormSchema = z.object({
    name: z.string().min(1),
})

interface CategoryFormProps {
    initialData: Category | null;
};

const CategoryForm: React.FC<CategoryFormProps> = ({
    initialData,
}) => {
    const params = useParams();
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const title = initialData ? 'Edit category' : 'Create category';
    const toastMessage = initialData ? 'Category updated.' : 'Category created.';
    const action = initialData ? 'Save changes' : 'Create';

    const defaultValues = initialData || {
        name: ''
    }

    const form = useForm<z.infer<typeof categoryFormSchema>>({
        resolver: zodResolver(categoryFormSchema),
        defaultValues
    })

    const onSubmit = async (data: z.infer<typeof categoryFormSchema>) => {
        console.log("category onsubmit: ")
        try {
            setLoading(true);
            if (initialData) {
                await axios.patch(`/api/categories/${params.categoryId}`, data);
            } else {
                await axios.post(`/api/categories`, data);
            }
            router.refresh();
            router.push(`/protected/categories`);
            toast.success(toastMessage);
        } catch (error: any) {
            toast.error('Something went wrong.');
        } finally {
            setLoading(false);
        }
    }

    const onDelete = async () => {
        try {
            setLoading(true);
            await axios.delete(`/api/categories/${params.categoryId}`);
            router.refresh();
            router.push(`/protected/categories`);
            toast.success('Category deleted.');
        } catch (error: any) {
            toast.error('Make sure you removed all products using this category first.');
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
                    <div className="md:grid md:grid-cols-3 gap-8">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Category name"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button disabled={loading} className="ml-auto" type="submit">
                        {action}
                    </Button>
                </form>
            </Form>
        </>
    )
}

export default CategoryForm;