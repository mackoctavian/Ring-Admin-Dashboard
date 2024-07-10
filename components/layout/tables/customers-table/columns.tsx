"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { Customer } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { StateColumn } from "../state-column";
import { DateTimeColumn } from "../date-colum";

export const columns: ColumnDef<Customer>[] = [
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
    header: "NAME",
  },
  {
    accessorKey: "phoneNumber",
    header: "PHONE",
  },
  {
    accessorKey: "email",
    header: "EMAIL",
  },
  {
    accessorKey: "registrationBranch.name",
    header: "BRANCH",
  },
  {
    header: "LAST VISIT",
    id: "lastVisitDate",
    cell: ({ row }) => <DateTimeColumn value={row.original.lastVisitDate} />,
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
