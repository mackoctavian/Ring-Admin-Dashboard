"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { Stock } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { MoneyColumn } from "../money-colum";
import { DateTimeColumn } from "../date-colum";
import { NumberColumn } from "../number-column";

export const columns: ColumnDef<Stock>[] = [
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
    id: "item",
    accessorKey: "item.fullName",
    header: "ITEM",
  },
  {
    header: "QUANTITY",
    id: "quantity",
    cell: ({ row }) => <NumberColumn value={row.original.quantity} />,
  },
  {
    accessorKey: "supplier.name",
    header: "SUPPLIER",
  },
  {
    header: "COST",
    id: "value",
    cell: ({ row }) => <MoneyColumn value={row.original.value} />,
  },
  {
    header: "DATE",
    id: "intakeDate",
    cell: ({ row }) => <DateTimeColumn value={row.original.$createdAt} />,
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
