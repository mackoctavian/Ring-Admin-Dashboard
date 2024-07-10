"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { Device } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { StateColumn } from "../state-column";
import { DateTimeColumn } from "../date-colum";

export const columns: ColumnDef<Device>[] = [
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
    accessorKey: "branchId",
    header: "BRANCH",
  },
  {
    header: "LAST SYNC",
    id: "lastSync",
    cell: ({ row }) => <DateTimeColumn value={row.original.lastSync} />,
  },
  {
    header: "STATUS",
    id: "status",
    cell: ({ row }) => <StateColumn state={row.original.status} />,
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
