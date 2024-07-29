"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { Category } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { StateColumn } from "../state-column";
import {BadgeColumn} from "@/components/layout/tables/badge-column";

export const columns: ColumnDef<Category>[] = [
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
    header: "Name",
    enableSorting: true,
  },
  {
    accessorKey: "type",
    header: "Category type",
    // @ts-ignore
    cell: ({ row }) => <BadgeColumn value={row.original.type } />,
  },
  {
    accessorKey: "parentName",
    header: "Parent category",
  },
  {
    accessorKey: "description",
    header: "Description",
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
