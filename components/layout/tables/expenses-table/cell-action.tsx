"use client"

import React, { useState } from "react";
import { AlertModal } from "@/components/layout/modal/alert-modal";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Expense } from "@/types";
import { Edit, MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { deleteItem } from "@/lib/actions/expense.actions"
import { useToast } from "@/components/ui/use-toast"

interface CellActionProps {
  data: Expense;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { toast } = useToast()

  const onConfirm = async () => {
      setIsLoading(true);
  
      try {
          if (data) {
              await deleteItem(data);
              toast({
                  variant: "default",
                  title: "Success", 
                  description: "Expense deleted successfully!"
              });
          } else {
            toast({
              variant: "destructive",
              title: "Uh oh! Something went wrong.", 
              description: "There was an issue with your request, please try again later"
            });
          }
      } catch (error: any) {
        toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.", 
            description: error.message || "There was an issue with your request, please try again later"
        });
      } finally {
        setIsLoading(false)
      }
  }

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={isLoading}
      />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          <DropdownMenuItem onClick={() => router.push(`/dashboard/expenses/${data.$id}`)}>
            <Edit className="mr-2 h-4 w-4" /> Update
          </DropdownMenuItem>
          {/*<DropdownMenuItem onClick={() => setOpen(true)}>*/}
          {/*  <Trash className="mr-2 h-4 w-4" /> Delete*/}
          {/*</DropdownMenuItem>*/}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
