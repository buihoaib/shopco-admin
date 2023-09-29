"use client";

import { KeyboardEvent, useEffect, useState } from "react";

import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SizeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    loading: boolean;
    setType: React.Dispatch<React.SetStateAction<any>>;
    setStock: React.Dispatch<React.SetStateAction<any>>;
    type: string;
    stock: number;
    editFlag: boolean;
}

export const SizeModal: React.FC<SizeModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    loading,
    setType,
    setStock,
    type,
    stock,
    editFlag,
}) => {
    const [isMounted, setIsMounted] = useState(false);
    const [hasError, setErrorFlag] = useState(false);
    const [stockString, setStockString] = useState(stock.toString());

    const errorMessage = "Please fill in all of your fields";

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (isOpen) setStockString(stock.toString());
    }, [isOpen]);

    useEffect(() => {
        if (isMounted) {
            if (stockString.length > 0) {
                setStock(parseInt(stockString));
            }
        }
    }, [stockString]);

    if (!isMounted) {
        return null;
    }

    function blockInvalidChar(event: KeyboardEvent<HTMLInputElement>): void {
        if (['e', 'E', '+', '-'].includes(event.key)) {
            event.preventDefault();
        }
    }

    function onAddButtonClicked(): void {
        if (!hasError && type.length > 0 && stockString.length > 0) {
            setErrorFlag(false);
            setStockString('');

            onConfirm();
        } else {
            setErrorFlag(true);
        }
    }

    function onModalClose(): void {
        setErrorFlag(false);
        onClose();
    }

    return (
        <Modal
            title={editFlag ? "Edit Size" : "Add Size"}
            description="Please enter the type and stock for this size."
            isOpen={isOpen}
            onClose={onModalClose}
        >
            <div className="flex gap-4 justify-center">
                <div>
                    <Label htmlFor="type">Type</Label>
                    <Input
                        id="type"
                        placeholder="S"
                        value={type || ''}
                        disabled={loading}
                        type="text"
                        minLength={1}
                        required={true}
                        onChange={(event) => {
                            setType((event.target.value).toUpperCase());
                        }}
                        className="uppercase"
                    />
                </div>
                <div>
                    <Label htmlFor="number">Stock</Label>
                    <Input
                        id="stock"
                        placeholder="0"
                        value={stockString || ''}
                        disabled={loading}
                        onChange={(event) => {
                            setStockString(event.target.value);
                        }}
                        onKeyDown={(event) => blockInvalidChar(event)}
                    />
                </div>
            </div>
            <div className="flex flex-col w-full">
                {hasError && (
                    <p className="flex text-red-500 text-sm pt-2 justify-center">{errorMessage}</p>
                )}
                <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                    <Button disabled={loading} variant="outline" onClick={onModalClose}>
                        Cancel
                    </Button>
                    <Button disabled={loading} variant="default" onClick={onAddButtonClicked}>
                        {editFlag ? "Save" : "Add New Size"}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};
