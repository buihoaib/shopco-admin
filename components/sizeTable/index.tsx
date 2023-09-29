import { useEffect, useState } from "react";
import { Edit, Plus, Trash, MoreHorizontal } from "lucide-react";
import { toast } from "react-hot-toast";
import { format } from "date-fns";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { SizeModal } from "./sizeModal";

interface SizeTableProps {
    disabled?: boolean;
    onChange: (type: string, stock: number, id?: string) => void;
    onRemove: (type: string) => void;
    onEdit: (type: string, stock: number, oldType: string) => void;
    value: { type: string, stock: number, id?: string, updatedAt?: number | Date }[];
}

const SizeTable: React.FC<SizeTableProps> = ({
    disabled,
    onChange,
    onRemove,
    onEdit,
    value
}) => {
    const [isMounted, setIsMounted] = useState(false);

    const [type, setType] = useState('');
    const [stock, setStock] = useState(0);
    const [oldType, setOldType] = useState(type);
    const [oldIndex, setOldIndex] = useState(-1);

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [editFlag, setEditFlag] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    const onAddOrEdit = () => {
        if (editFlag) {
            const duplicateSizeIndex = value.findIndex((item) => item.type === type);
            if (duplicateSizeIndex === -1 || duplicateSizeIndex === oldIndex) {
                onEdit(type, stock, oldType);
                setEditFlag(false);
            } else {
                // If this type already exists for this product, skip edit
                toast.error('Each type must be unique!');
            }
        } else {
            if (value.find((item) => item.type === type)) {
                // If this type already exists for this product, skip add
                toast.error('Each type must be unique!');
            } else {
                onChange(type, stock);
            }
        }

        setType('');
        setStock(0);
        setOpen(false);
    };

    function onModalEdit(type: string, stock: number, key: number): void {
        setType(type);
        setStock(stock);

        setOldType(type);
        setOldIndex(key);

        setEditFlag(true);
        setOpen(true);
    }

    return (
        <div className="flex flex-col">
            <SizeModal
                isOpen={open}
                onClose={() => {
                    setType('');
                    setStock(0);
                    setOpen(false);
                }}
                onConfirm={() => onAddOrEdit()}
                loading={loading}
                setType={setType}
                setStock={setStock}
                type={type}
                stock={stock}
                editFlag={editFlag}
            />
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Updated at</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {value.length ? value.map((item, key) => (
                        <TableRow key={key} >
                            <TableCell >{item.type}</TableCell>
                            <TableCell>{item.stock}</TableCell>
                            <TableCell>
                                {format(item.updatedAt || Date.now(), 'MMMM do, yyyy')}
                            </TableCell>
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <span className="sr-only">Open menu</span>
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                        <DropdownMenuItem
                                            onClick={() => onModalEdit(item.type, item.stock, key)}
                                        >
                                            <Edit className="mr-2 h-4 w-4" /> Update
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => onRemove(item.type)}
                                        >
                                            <Trash className="mr-2 h-4 w-4" /> Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                {/* <Button
                                    type="button"
                                    disabled={loading}
                                    onClick={() => onModalEdit(item.type, item.stock, key)}
                                    className="w-max"
                                >
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit
                                </Button>
                                <Button
                                    type="button"
                                    disabled={loading}
                                    onClick={() => onRemove(item.type)}
                                    variant={"destructive"}
                                    className="w-max"
                                >
                                    <Trash className="h-4 w-4 mr-2" />
                                    Delete
                                </Button> */}
                            </TableCell>
                        </TableRow>
                    )) : (
                        <TableRow>
                            <TableCell colSpan={3} className="h-24 text-center">
                                No results.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            <div className="flex my-2 justify-end">
                <Button
                    type="button"
                    variant="outline"
                    disabled={disabled}
                    onClick={() => setOpen(true)}
                    className="border-2 border-black text-black"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Size
                </Button>
            </div>
        </div >
    )
}

export default SizeTable;