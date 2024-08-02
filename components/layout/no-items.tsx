import {buttonVariants} from "@/components/ui/button"
import {cn} from "@/lib/utils";
import {Plus} from "lucide-react";
import Link from "next/link";
import React from "react";

interface NoItemsProps {
    newItemUrl: string;
    itemName: string;
}

export default function NoItems({ newItemUrl, itemName }: NoItemsProps) {
    return (
        <div className='h-[calc(100vh-220px)] border border-dashed'>
            <div className='m-auto flex h-full w-full flex-col items-center justify-center gap-2'>
                <h1 className='text-[1.5rem] font-bold leading-tight'>You have no {itemName}(s)</h1>
                <p className='text-sm text-center text-muted-foreground'>
                    You do not have any {itemName}(s) in your records, add {itemName}(s) to start viewing data.
                </p>
                <div className='mt-6 flex gap-4'>
                    <Link href={newItemUrl} className={cn(buttonVariants({ variant: "default" }))} >
                        <Plus className="mr-2 h-4 w-4" /> Add {itemName}(s)
                    </Link>
                </div>
            </div>
        </div>
    )
}