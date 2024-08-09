"use client";
import { Checkbox } from "@/components/ui/checkbox";
import {ExpensePayment} from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { DateTimeColumn } from "../date-colum";
import {MoneyColumn} from "@/components/layout/tables/money-colum";


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
    id: "name",
    accessorKey: "expense.name",
    header: "Expense",
  },
  {
    accessorKey: "paymentMethod",
    header: "Payment Method",
  },
  {
    header: "Paid amount",
    id: "amount",
    cell: ({ row }) => (
        <MoneyColumn
            currency={row.original.currency ?? "TZS"}
            value={row.original.amount ?? 0}
        />
    ),
  },
  {
    id: "paymentDate",
    header: "Payment Date",
    // @ts-ignore
    cell: ({ row }) => <DateTimeColumn value={row.original.paymentDate}  />,
  },
  {
    accessorKey: "description",
    header: "Description",
  },
];
