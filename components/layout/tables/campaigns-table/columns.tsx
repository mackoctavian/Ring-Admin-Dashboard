"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { Campaign } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { DateTimeColumn } from "../date-colum";

export const columns: ColumnDef<Campaign>[] = [
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
    accessorKey: "title",
    header: "Campaign title",
  },
  {
    header: "Campaign date",
    id: "scheduleDate",
    //@ts-ignore
    cell: ({ row }) => <DateTimeColumn value={row.original.scheduleDate} />,
  },
  {
    accessorKey: "message",
    header: "Message",
  },
];
