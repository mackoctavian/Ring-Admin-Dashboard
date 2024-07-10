"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { Discount } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { StateColumn } from "../state-column";
import { NumberColumn } from "../number-column";


const getSuffix = (type: string) => {
  if (type === 'PERCENTAGE') {
      return ' %';
  } else if (type === 'AMOUNT') {
      return ' TSH';
  }
  return '';
};

export const columns: ColumnDef<Discount>[] = [
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
    accessorKey: "code",
    header: "CODE",
  },
  {
    accessorKey: "type",
    header: "TYPE",
  },
  {
    header: "VALUE",
    id: "value",
    cell: ({ row }) => <NumberColumn suffix={getSuffix(row.original.type)} value={row.original.value} />,
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

