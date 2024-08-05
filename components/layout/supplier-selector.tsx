import React, { useEffect, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { list } from "@/lib/actions/supplier.actions"
import { Supplier } from "@/types";

interface Props {
  value?: string;
  onChange: (value: string) => void;
}

const SupplierSelector: React.FC<Props> = ({ value, onChange }) => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSuppliers() {
      try {
        setIsLoading(true);
        const suppliersData = await list();
        setSuppliers(suppliersData || []); // Ensure it's always an array
        setError(null);
      } catch (error: any) {
        setError("Failed to load suppliers");
        console.error("Error fetching suppliers:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchSuppliers();
  }, []);

  const handleSelectChange = (selectedId: string) => {
    onChange(selectedId === 'default' ? '' : selectedId);
  };

  const selectedSupplier = suppliers.find(sup => sup.$id === value);

  if (isLoading) {
    return <div className={`text-sm text-muted-foreground`}>Loading suppliers...</div>;
  }

  if (error) {
    return <div className={`text-sm text-destructive-foreground`}>Error: could not load suppliers</div>;
  }

  return (
      <Select value={value || 'default'} onValueChange={handleSelectChange}>
        <SelectTrigger>
          <SelectValue>
            {value ? selectedSupplier?.name || 'Select supplier' : 'Select supplier'}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="default" disabled>
            Select supplier
          </SelectItem>
          {suppliers.map((supplier) => (
              <SelectItem key={supplier.$id} value={supplier.$id}>
                {supplier.name || 'Unnamed supplier'}
              </SelectItem>
          ))}
        </SelectContent>
      </Select>
  );
};

export default SupplierSelector;