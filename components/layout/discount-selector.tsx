
import React, { useEffect, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { list } from "@/lib/actions/discount.actions"
import { Discount } from "@/types";

interface Props {
  value?: Discount;
  onChange: (value: Discount) => void;
}

const DiscountSelector: React.FC<Props> = ({ value, onChange }) => {
  const [discounts, setDiscounts] = useState<Discount[]>([]);

  useEffect(() => {
    async function fetchDiscounts() {
      try {
        const discountsData = await list();
        setDiscounts(discountsData);
      } catch (error) {
        console.error('Error fetching discounts:', error);
      }
    }
    fetchDiscounts();
  }, []);

  const handleSelectChange = (value: string) => {
    const selectedDiscount = discounts.find(disc => disc.$id === value);
    if (selectedDiscount) {
      onChange(selectedDiscount);
    }
  };

  return (
    <Select value={value ? value.$id : 'Select Discount'} onValueChange={handleSelectChange}>
      <SelectTrigger>
        <SelectValue>
          {value ? value.name : 'Select Discount'}
        </SelectValue>
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
};

export default DiscountSelector;