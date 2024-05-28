"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { Service } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { StateColumn } from "../state-column";
import { MoneyColumn } from "../money-colum";
import { DateTimeColumn } from "../date-colum";

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
    header: "START TIME",
    id: "offeringStartTime",
    cell: ({ row }) => <DateTimeColumn value={row.original.offeringStartTime} type="timeOnly" />,
  },
  {
    id: "offeringEndTime",
    header: "END TIME",
    cell: ({ row }) => <DateTimeColumn value={row.original.offeringEndTime} type="timeOnly" />,
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
