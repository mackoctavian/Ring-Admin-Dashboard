'use client'

import React, { useState, useEffect } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { Switch } from "@/components/ui/switch"
import { ReloadIcon } from "@radix-ui/react-icons"
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "@radix-ui/react-icons"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input";
import { Department, Staff } from "@/types";
import { createItem, updateItem } from "@/lib/actions/staff.actions"
import { useToast } from "@/components/ui/use-toast"
import CancelButton from "../layout/cancel-button";
import DepartmentSelector from "@/components/layout/department-selector"
import CountrySelector from "../layout/country-selector";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
  
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"


    enum Gender {
        MALE = "MALE",
        FEMALE = "FEMALE",
        UNDISCLOSED = "UNDISCLOSED",
    }

    const phoneNumberRegex = /^[0-9]{10,15}$/;

    export const DepartmentSchema = z.object({
        $id: z.string(),
        name: z.string(),
        shortName: z.string(),
        status: z.boolean(),
      });
      
      const formSchema = z.object({
        name: z.string(),
        email: z.string().email("Invalid email address").trim().max(40).min(10),
        phoneNumber: z.string().regex(phoneNumberRegex, "Invalid phone number. It should contain 10 to 15 digits."),
        code: z.preprocess((val) => val === null ? undefined : val, z.string().optional()),
        gender: z.nativeEnum(Gender),
        dateOfBirth: z.preprocess((val) => {
          if (val === null) return undefined;
          if (typeof val === "string" && val.trim() !== "") {
            return new Date(val);
          }
          return val;
        }, z.date().optional()),
        nationality: z.preprocess((val) => val === null ? "" : val, z.string().optional()),
        joiningDate: z.preprocess((val) => {
          if (typeof val === "string" && val.trim() !== "") {
            return new Date(val);
          }
          return val;
        }, z.date()),
        jobTitle: z.string(),
        emergencyNumber: z.preprocess((val) => val === null ? "" : val, z.string().optional()),
        address: z.preprocess((val) => val === null ? "" : val, z.string().optional()),
        notes: z.preprocess((val) => val === null ? "" : val, z.string().optional()),
        image: z.preprocess((val) => val === null ? "" : val, z.string().optional()),
        status: z.boolean(),
        department: DepartmentSchema,
      });
      
      const StaffForm = ({ item }: { item?: Staff | null }) => {
        const router = useRouter();
        const [isLoading, setIsLoading] = useState(false);
        const { toast } = useToast();
        
        const [selectedDepartment, setSelectedDepartment] = useState<Department | undefined>(
          item ? item.department : undefined
        );
      
        const form = useForm<z.infer<typeof formSchema>>({
          resolver: zodResolver(formSchema),
          defaultValues: item ? { ...item, department: item.department } : {
            status: false,
            notes: ''
          },
        });
      
        const onInvalid = (errors: any) => {
          toast({
            variant: "warning",
            title: "Uh oh! Something went wrong.",
            description: "There was an issue submitting your form please try later"
          });
          console.error(errors);
        };
      
        const onSubmit = async (data: z.infer<typeof formSchema>) => {
          setIsLoading(true);      
          toast({
            variant: "success",
            title: "Success",
            description: JSON.stringify(data)
          });
      
          try {
            if (item) {
              await updateItem(item.$id, data);
              toast({
                variant: "success",
                title: "Success",
                description: "Employee details updated successfully!"
              });
            } else {
              await createItem(data);
              toast({
                variant: "success",
                title: "Success",
                description: "Employee added successfully!"
              });
            }
      
            // Redirect to the list page after submission
            router.push("/staff");
            router.refresh();
            setIsLoading(false);
          } catch (error: any) {
            toast({
              variant: "destructive",
              title: "Uh oh! Something went wrong.",
              description: error.message || "There was an issue submitting your form, please try later"
            });
          } finally {
            // Delay loading
            setTimeout(() => {
              setIsLoading(false);
            }, 1000);
          }
        };
      
        useEffect(() => {
          if (item) {
            setSelectedDepartment(item.department);
          }
        }, [item]);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="space-y-8">

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Full name</FormLabel>
                            <FormControl>
                                <Input
                                placeholder="Enter employee's name"
                                className="input-class"
                                {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Employee email address</FormLabel>
                            <FormControl>
                                <Input
                                type="email"
                                placeholder="Enter employee's email address"
                                className="input-class"
                                {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                        
                    <FormField
                        control={form.control}
                        name="phoneNumber"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Employee phone number</FormLabel>
                            <FormControl>
                                <Input
                                type="tel"
                                placeholder="Enter employee's phone number"
                                className="input-class"
                                {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                        
                    <FormField
                        control={form.control}
                        name="code"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Staff ID</FormLabel>
                            <FormControl>
                                <Input
                                placeholder="Enter employee's staff id"
                                className="input-class"
                                {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="jobTitle"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Job Title</FormLabel>
                            <FormControl>
                                <Input
                                placeholder="Enter employee's job title"
                                className="input-class"
                                {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                                <Input
                                placeholder="Enter employee home address"
                                className="input-class"
                                {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="gender"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Gender</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select gender" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value={Gender.UNDISCLOSED}>Do not disclose</SelectItem>
                                    <SelectItem value={Gender.MALE}>Male</SelectItem>
                                    <SelectItem value={Gender.FEMALE}>Female</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                            </FormItem>
                        )}
                        />

                    <FormField
                        control={form.control}
                        name="nationality"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nationality</FormLabel>
                                <CountrySelector onChange={field.onChange} value={field.value} />
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    

                    <FormField
                        control={form.control}
                        name="dateOfBirth"
                        render={({ field }) => (
                            <FormItem className="flex flex-col mt-2">
                                <FormLabel>Date of birth</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button variant={"outline"} className={cn( "font-normal", !field.value && "text-muted-foreground" )}>
                                            {field.value ? ( format(field.value, "PPP") ) : (
                                                <span>Select date of birth</span>
                                            )}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        disabled={ (date) => date > new Date() || date < new Date("1970-01-01") }
                                        initialFocus
                                    />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="department"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Department</FormLabel>
                            <DepartmentSelector 
                            value={selectedDepartment}
                            onChange={(dept) => { setSelectedDepartment(dept); field.onChange(dept); }}
                            />
                            <FormMessage />
                        </FormItem>
                        )}
                    />


                    <FormField
                        control={form.control}
                        name="joiningDate"
                        render={({ field }) => (
                            <FormItem className="flex flex-col mt-2">
                            <FormLabel>Date joined</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                <FormControl>
                                    <Button
                                    variant={"outline"}
                                    className={cn( "font-normal", !field.value && "text-muted-foreground" )}
                                    >
                                    {field.value ? (
                                        format(field.value, "PPP")
                                    ) : (
                                        <span>Select date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    disabled={(date) =>
                                    date > new Date() || date < new Date("1970-01-01")
                                    }
                                    initialFocus
                                />
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="emergencyNumber"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Emergency contact</FormLabel>
                            <FormControl>
                                <Input
                                type="tel"
                                placeholder="Enter emergency phone number"
                                className="input-class"
                                {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    
                </div>
                    <FormField
                        control={form.control}
                        name="notes"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Admin notes</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Any other important details about the employee"
                                    className="resize-none"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                
            
            

                <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Status</FormLabel>
                        <FormControl>
                            <Switch
                                id="status"
                                checked={field.value}
                                onCheckedChange={field.onChange}
                            />
                        </FormControl>
                    </FormItem>
                    )}
                />

        
                <div className="flex h-5 items-center space-x-4">
                    <CancelButton />
                
                    <Separator orientation="vertical" />

                    <Button type="submit">
                        {isLoading ? (
                            <>
                                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" /> &nbsp; Processing...
                            </>
                            ) : (
                            item ? "Update employee details" : "Save employee details"
                        )}
                    </Button> 
                </div>
            </form>
        </Form>
        );
    };
  
export default StaffForm;