"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { Branch } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { StateColumn } from "../state-column";

export const columns: ColumnDef<Branch>[] = [
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
    header: "Branch name",
  },
  {
    accessorKey: "phoneNumber",
    header: "Branch phone number",
  },
  {
    accessorKey: "email",
    header: "Branch email address",
  },
  {
    accessorKey: "address",
    header: "Branch address",
  },
  {
    accessorKey: "openingTime",
    header: "Branch opening time",
  },
  {
    accessorKey: "closingTime",
    header: "Branch closing time",
  },
  {
    header: "Status",
    id: "status",
    cell: ({ row }) => <StateColumn state={row.original.status} />,
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
