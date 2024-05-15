"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { InventoryCategory } from "@/data/models/inventory-category-model";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";

export const columns: ColumnDef<InventoryCategory>[] = [
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
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "categoryName",
    header: "NAME",
  },
  {
    accessorKey: "categorySlug",
    header: "SLUG",
  },
  {
    accessorKey: "categoryType",
    header: "TYPE",
  },
  {
    accessorKey: "parent",
    header: "PARENT ",
  },
  {
    accessorKey: "description",
    header: "DESCRIPTION",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
