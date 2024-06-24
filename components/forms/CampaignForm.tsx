'use client'

import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast"
import { useState } from "react";
import { format } from "date-fns"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Campaign } from "@/types";
import { createItem, updateItem } from "@/lib/actions/campaign.actions"
import CancelButton from "../layout/cancel-button";
import { CampaignAudience, CampaignSchema } from "@/types/data-schemas";
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "@radix-ui/react-icons"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import * as z from "zod";
import { SubmitButton } from "@/components/ui/submit-button";
import "react-day-picker/style.css";

const CampaignForm = ({ item }: { item?: Campaign | null }) => {
    const [isLoading, setIsLoading] = useState(false)
    const { toast } = useToast()

    const form = useForm<z.infer<typeof CampaignSchema>>({
        resolver: zodResolver(CampaignSchema),
        defaultValues: item ? item : {},
    });

    const onInvalid = (errors : any ) => {
        toast({
            variant: "warning",
            title: "Data validation failed!",
            description: "Please make sure all the fields marked with * are filled correctly."
        });
    }

    const onSubmit = async (data: z.infer<typeof CampaignSchema>) => {
        setIsLoading(true);
        try {
            if (item) {
                await updateItem(item.$id!, data);
                toast({
                    variant: "success",
                    title: "Success",
                    description: "Broadcast message has been updated succesfully!"
                });
            } else {
                await createItem(data);
                toast({
                    variant: "success",
                    title: "Success",
                    description: "Broadcast message has been scheduled succesfully!"
                });
            }
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: "There was an issue submitting your form, please try later"
            });
        } finally {
        //delay loading
        setTimeout(() => {
            setIsLoading(false);
            }, 1000);
        }
    };

return (
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="space-y-8">
          <div className="grid grid-cols-3 gap-4">
            <FormField
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Title"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
  
            <FormField
              name="audience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Audience *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select audience" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={CampaignAudience.ALL}>All ( Customers & Staff )</SelectItem>
                      <SelectItem value={CampaignAudience.CUSTOMERS}>Customers</SelectItem>
                      <SelectItem value={CampaignAudience.STAFF}>Staff</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
  
            <FormField
              name="scheduleDate"
              render={({ field }) => (
                <FormItem className="flex flex-col mt-2">
                  <FormLabel>Campaign date *</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button variant={"outline"} className={cn("font-normal", !field.value && "text-muted-foreground")}>
                          {field.value ? format(field.value, "PPP") : (
                            <span>Select date to send your message</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        hideNavigation={true}
                        captionLayout="dropdown"
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date() || date < new Date("1970-01-01")}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
  
          <FormField
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Message *</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter campaign message"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
  
          <div className="flex h-5 items-center space-x-4">
            <CancelButton />
            <Separator orientation="vertical" />
            <SubmitButton label={item ? "Re-broadcast campaign" : "Schedule broadcast"} loading={isLoading} />
          </div>

        </form>
      </Form>
    );
  };
  
  export default CampaignForm;