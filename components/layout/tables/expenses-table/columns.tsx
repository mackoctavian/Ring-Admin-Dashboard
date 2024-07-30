"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { Expense } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { NumberColumn } from "../number-column";
import { DateTimeColumn } from "../date-colum";
import {BadgeColumn} from "@/components/layout/tables/badge-column";

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
    header: "Title",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    header: "Amount",
    id: "amount",
    cell: ({ row }) => <NumberColumn suffix={row.original.currency} value={row.original.amount} />,
  },
  {
    header: "Balance",
    id: "balance",
    cell: ({ row }) => <NumberColumn suffix={row.original.currency} value={row.original.balance} />,
  },
  {
    id: "dueDate",
    header: "Due Date",
    // @ts-ignore
    cell: ({ row }) => <DateTimeColumn value={row.original.dueDate}  />,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <BadgeColumn value={row.original.status}  />,
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
