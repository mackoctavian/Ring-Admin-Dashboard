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
  value?: Discount | null; // Update the type to allow null
  onChange: (value: Discount | null) => void; // Update the type to allow null
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
    if (value === 'null') { // Check if the value is 'null'
      onChange(null);
    } else {
      const selectedDiscount = discounts.find(disc => disc.$id === value);
      if (selectedDiscount) {
        onChange(selectedDiscount);
      }
    }
  };

  return (
    <Select value={value ? value.$id : 'null'} onValueChange={handleSelectChange}>
      <SelectTrigger>
        <SelectValue>
          {value ? value.name : 'Select Discount'}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {/* Add the option for selecting no discount */}
        <SelectItem key="null" value="null">No Discount</SelectItem>
        {/* Render other discounts */}
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
