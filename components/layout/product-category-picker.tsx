import React from 'react'

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    SelectGroup,
    SelectLabel,
  } from "@/components/ui/select";

  import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form";

function ProductCategoryPicker() {
  return (
    <Select onValueChange={field.onChange} defaultValue={field.value}>
        <FormControl>
            <SelectTrigger>
            <SelectValue placeholder="Select a verified email to display" />
            </SelectTrigger>
        </FormControl>
        <SelectContent>
            <SelectItem value="Category Id">Category name</SelectItem>
        </SelectContent>
    </Select>
  )
}

export default ProductCategoryPicker