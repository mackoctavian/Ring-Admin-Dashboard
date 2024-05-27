"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { Expense } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { StateColumn } from "../state-column";

export const columns: ColumnDef<Expense>[] = [
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
    header: "TITLE",
  },
  {
    accessorKey: "category",
    header: "CATEGORY",
  },
  {
    accessorKey: "amount",
    header: "AMOUNT",
  },
  {
    accessorKey: "dueDate",
    header: "DUE DATE",
  },
  {
    accessorKey: "status",
    header: "STATUS",
  },
  
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
