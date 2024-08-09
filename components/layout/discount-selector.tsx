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
  value?: string | null;
  onChange: (value: string | null) => void;
}

const DiscountSelector: React.FC<Props> = ({ value, onChange }) => {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDiscounts() {
      try {
        setIsLoading(true);
        const discountsData = await list();
        setDiscounts(discountsData || []); // Ensure it's always an array
        setError(null);
      } catch (error: any) {
        setError("Failed to load discounts");
        console.error("Error fetching discounts:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchDiscounts();
  }, []);

  const handleSelectChange = (selectedId: string) => {
    onChange(selectedId === 'null' ? null : selectedId);
  };

  const selectedDiscount = discounts.find(disc => disc.$id === value);

  if (isLoading) {
    return <div className={`text-sm text-muted-foreground`}>Loading discounts...</div>;
  }

  if (error) {
    return <div className={`text-sm text-destructive-foreground`}>Error: could not load discounts</div>;
  }

  return (
      <Select value={value || 'null'} onValueChange={handleSelectChange}>
        <SelectTrigger>
          <SelectValue>
            {selectedDiscount ? selectedDiscount.name : 'Select Discount'}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="null">No Discount</SelectItem>
          {discounts.map((discount) => (
              <SelectItem key={discount.$id} value={discount.$id}>
                {discount.name || 'Unnamed discount'}
              </SelectItem>
          ))}
        </SelectContent>
      </Select>
  );
};

export default DiscountSelector;