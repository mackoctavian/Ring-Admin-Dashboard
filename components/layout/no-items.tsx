import {buttonVariants} from "@/components/ui/button"
import {cn} from "@/lib/utils";
import {Plus} from "lucide-react";
import Link from "next/link";

interface NoItemsProps {
    newItemUrl: string;
    itemName: string;
}

export default function NoItems({ newItemUrl, itemName }: NoItemsProps) {
    return (
        <div className="flex items-center justify-center rounded-lg border border-dashed shadow-sm min-h-screen w-full">
            <div className="flex flex-col items-center gap-1 text-center">
                <h3 className="text-2xl font-bold tracking-tight mb-2">
                    You have no {itemName}(s)
                </h3>
                <p className="text-sm text-muted-foreground mb-2">
                    You do not have any {itemName}(s) in your records, add {itemName}(s) to start viewing data.
                </p>
                <Link href={newItemUrl} className={cn(buttonVariants({variant: "default"}))}>
                    <Plus className="mr-2 h-4 w-4"/> Add {itemName}(s)
                </Link>
            </div>
        </div>
    );
}