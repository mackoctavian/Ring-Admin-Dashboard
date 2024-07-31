"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { Inventory, InventoryVariant } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { NumberColumn } from "../number-column";
import { MoneyColumn } from "../money-colum";

export const columns: ColumnDef<InventoryVariant>[] = [
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
    id: "fullName",
    accessorKey: "fullName",
    header: "Stock item",
  },
  {
    id: "packaging",
    accessorKey: "inventory.packaging",
    header: "Packaging",
  },
  {
    header: "Quantity",
    id: "quantity",
    cell: ({ row }) => <NumberColumn value={row.original.quantity} />,
  },
  {
    header: "Value",
    id: "value",
    cell: ({ row }) => <MoneyColumn value={row.original.value} />,
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
