"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { Stock } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
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
    header: "Stock item",
  },
  {
    header: "Quantity",
    id: "quantity",
    cell: ({ row }) => <NumberColumn value={row.original.quantity} />,
  },
  {
    accessorKey: "supplier.name",
    header: "Supplier",
  },
  {
    header: "Stock value",
    id: "value",
    cell: ({ row }) => <MoneyColumn value={row.original.value} />,
  },
  {
    header: "Date received",
    id: "intakeDate",
    //@ts-ignore
    cell: ({ row }) => <DateTimeColumn value={row.original.deliveryDate} />,
  },
  {
    header: "Received by",
    accessorKey: "staff.name",
  },
];
