"use client"

import { Checkbox } from "@/components/ui/checkbox";
import { Product } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { BadgeColumn } from "@/components/layout/tables/badge-column";
import Image from "next/image";

export const columns: ColumnDef<Product>[] = [
  {
    id: "select",
    header: ({ table }) => (
        <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
        />
    ),
    cell: ({ row }) => (
        <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
        />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Product Name",
  },
  {
    id: "image",
    header: "Image",
    cell: ({ row }) => (
        row.original.image ? (
            <Image
                //@ts-ignore
                src={row.original.image}
                alt={row.original.name}
                width={50}
                height={50}
                className="object-cover rounded"
                quality={50}
            />
        ) : (
            <span className={`text-sm text-muted-foreground`}>No Image</span>
        )
    ),
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      const description = row.original.description || "No description";
      return description.length > 100 ? `${description.substring(0, 100)}...` : description;
    },
  },
  {
    accessorKey: "posStatus",
    header: "Status",
    cell: ({ row }) => <BadgeColumn value={row.original.posStatus} />,
  },
  {
    id: "category",
    header: "Category",
    cell: ({ row }) => (
        <div>
          {row.original.category.map((cat, index) => (
              <BadgeColumn key={index} value={cat.name} />
          ))}
        </div>
    ),
  },
  {
    id: "variants",
    header: "Variants",
    cell: ({ row }) => row.original.variants.length,
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
