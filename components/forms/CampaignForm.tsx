'use client'

import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast"
import React, { useState } from "react";
import { format } from "date-fns"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormItem,
} from "@/components/ui/form";
import { Campaign } from "@/types";
import { createItem, updateItem } from "@/lib/actions/campaign.actions"
import CancelButton from "../layout/cancel-button";
import {CampaignAudience, CampaignSchema, Gender} from "@/types/data-schemas";
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "@radix-ui/react-icons"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {SelectItem} from "@/components/ui/select"
import * as z from "zod";
import { SubmitButton } from "@/components/ui/submit-button";
import "react-day-picker/style.css";
import CustomFormField, {FormFieldType} from "@/components/ui/custom-input";

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
                    description: "Broadcast message has been updated successfully!"
                });
            } else {
                await createItem(data);
                toast({
                    variant: "success",
                    title: "Success",
                    description: "Broadcast message has been scheduled successfully!"
                });
            }
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: "There was an issue submitting your form, please try later"
            });
        } finally {
            setIsLoading(false);
        }
    };

return (
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

              <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="title"
                  label="Broadcast title *"
                  placeholder="Enter broadcast title"
              />

              <CustomFormField
                  fieldType={FormFieldType.SELECT}
                  control={form.control}
                  name="audience"
                  label="Audience *"
                  placeholder="Select audience">
                      <SelectItem value={CampaignAudience.ALL}>All ( Customers & Staff )</SelectItem>
                      <SelectItem value={CampaignAudience.CUSTOMERS}>Customers</SelectItem>
                      <SelectItem value={CampaignAudience.STAFF}>Staff</SelectItem>
              </CustomFormField>

              <CustomFormField
                  fieldType={FormFieldType.SKELETON}
                  control={form.control}
                  name="scheduleDate"
                  label="Campaign date *"
                  renderSkeleton={(field) => (
                      <FormItem className="flex flex-col mt-2">
                          <Popover>
                              <PopoverTrigger asChild>
                                  <FormControl>
                                      <Button variant={"outline"} className={cn( "font-normal", !field.value && "text-muted-foreground" )}>
                                          {field.value ? ( format(field.value, "PPP") ) : (
                                              <span>Select date to broadcast your message</span>
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
                      </FormItem>
                  )}
              />
          </div>

            <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="message"
                label="Message to broadcast *"
                placeholder="Enter campaign message"
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