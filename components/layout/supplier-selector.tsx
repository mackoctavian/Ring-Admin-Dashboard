
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
  value?: Supplier;
  onChange: (value: Supplier) => void;
}

const SupplierSelector: React.FC<Props> = ({ value, onChange }) => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  useEffect(() => {
    async function fetchSuppliers() {
      try {
        const suppliersData = await list();
        setSuppliers(suppliersData);
      } catch (error) {
        console.error('Error fetching suppliers:', error);
      }
    }
    fetchSuppliers();
  }, []);

  const handleSelectChange = (value: string) => {
    const selectedSupplier = suppliers.find(sup => sup.$id === value);
    if (selectedSupplier) {
      onChange(selectedSupplier);
    }
  };

  return (
    <Select value={value ? value.$id : 'Select Supplier'} onValueChange={handleSelectChange}>
      <SelectTrigger>
        <SelectValue>
          {value ? value.name : 'Select supplier'}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {suppliers.map((supplier) => (
          <SelectItem key={supplier.$id} value={supplier.$id}>
            {supplier.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default SupplierSelector;