"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { Expense } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { NumberColumn } from "../number-column";
import { DateTimeColumn } from "../date-colum";

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
    header: "AMOUNT",
    id: "amount",
    cell: ({ row }) => <NumberColumn suffix={row.original.currency} value={row.original.amount} />,
  },
  {
    header: "BALANCE",
    id: "balance",
    cell: ({ row }) => <NumberColumn suffix={row.original.currency} value={row.original.balance} />,
  },
  {
    id: "dueDate",
    header: "DUE DATE",
    cell: ({ row }) => <DateTimeColumn value={row.original.dueDate}  />,
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
