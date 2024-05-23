"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { Service } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { StateColumn } from "../state-column";
import { MoneyColumn } from "../money-colum";

export const columns: ColumnDef<Service>[] = [
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
    accessorKey: "category.name",
    header: "CATEGORY",
  },
  {
    header: "COST",
    id: "price",
    cell: ({ row }) => <MoneyColumn value={row.original.price} />,
  },
  {
    id: "duration",
    header: "DURATION",
    cell: ({ row }) => {
      const duration = row.original.duration;
      return duration ? `${duration} mins` : "";
    },
  },
  {
    accessorKey: "offeringStartTime",
    header: "START TIME",
  },
  {
    accessorKey: "offeringEndTime",
    header: "END TIME",
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
