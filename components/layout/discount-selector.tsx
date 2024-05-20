"use client";

import React, { useEffect, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import { list } from "@/lib/actions/discount.actions"
import { Discount } from "@/types";
import { parseStringify } from "@/lib/utils";

interface Props {
  value?: Discount;
  onChange: (value: Discount) => void;
}

export default function DiscountSelector({ value, onChange }: Props) {
  const [discounts, setDiscounts] = useState<Discount[]>([]);

  useEffect(() => {
    async function fetchDiscounts() {
      const discountsData = await list();
      setDiscounts(discountsData);
    }
    fetchDiscounts();
  }, []);

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder="Select discount" />
      </SelectTrigger>
      <SelectContent>
        {discounts.map((discount) => (
          <SelectItem key={discount.$id} value={discount.$id}>
            {discount.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}