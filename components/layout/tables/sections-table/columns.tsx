"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { Section } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { StateColumn } from "../state-column";
import {BadgeColumn} from "@/components/layout/tables/badge-column";

export const columns: ColumnDef<Section>[] = [
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
    header: "Space / Section name",
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => <BadgeColumn value={row.original.type} />,
  },
  {
    accessorKey: "branch.name",
    header: "Branch",
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
