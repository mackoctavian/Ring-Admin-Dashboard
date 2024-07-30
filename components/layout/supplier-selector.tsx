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
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchSuppliers() {
      try {
        const suppliersData = await list();
        setSuppliers(suppliersData);
      } catch (error) {
        console.error('Error fetching suppliers:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchSuppliers();
  }, []);

  const handleSelectChange = (selectedId: string) => {
    onChange(selectedId);
  };

  const selectedSupplier = suppliers.find(sup => sup.$id === value);

  return (
      <Select value={value || 'default'} onValueChange={handleSelectChange} disabled={loading}>
        <SelectTrigger>
          <SelectValue>
            {loading ? 'Loading...' : (selectedSupplier ? selectedSupplier.name : 'Select supplier')}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="default" disabled>
            Select supplier
          </SelectItem>
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