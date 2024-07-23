"use client";
import { Checkbox } from "@/components/ui/checkbox";
import {ExpensePayment} from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { NumberColumn } from "../number-column";
import { DateTimeColumn } from "../date-colum";


export const columns: ColumnDef<ExpensePayment>[] = [
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
    accessorKey: "expense.name",
    header: "EXPENSE",
  },
  {
    accessorKey: "paymentMethod",
    header: "PAYMENT METHOD",
  },
  {
    header: "AMOUNT",
    id: "amount",
    cell: ({ row }) => <NumberColumn value={row.original.amount} />,
  },
  {
    id: "paymentDate",
    header: "PAYMENT DATE",
    // @ts-ignore
    cell: ({ row }) => <DateTimeColumn value={row.original.paymentDate}  />,
  },
  {
    accessorKey: "description",
    header: "DESCRIPTION",
  },
];
