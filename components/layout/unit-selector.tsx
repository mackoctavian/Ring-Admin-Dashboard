
import React, { useEffect, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { list } from "@/lib/actions/product-unit.actions"
import { ProductUnit } from "@/types";

interface Props {
  value?: ProductUnit;
  onChange: (value: ProductUnit) => void;
}

const UnitSelector: React.FC<Props> = ({ value, onChange }) => {
  const [units, setUnits] = useState<ProductUnit[]>([]);

  useEffect(() => {
    async function fetchUnits() {
      try {
        const unitsData = await list();
        setUnits(unitsData);
      } catch (error) {
        console.error('Error fetching units:', error);
      }
    }
    fetchUnits();
  }, []);

  const handleSelectChange = (value: string) => {
    const selectedUnit = units.find(unt => unt.$id === value);
    if (selectedUnit) {
      onChange(selectedUnit);
    }
  };

  return (
    <Select value={value ? value.$id : 'Select Unit'} onValueChange={handleSelectChange}>
      <SelectTrigger>
        <SelectValue>
          {value ? value.name : 'Select Unit'}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {units.map((unit) => (
          <SelectItem key={unit.$id} value={unit.$id}>
            {unit.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default UnitSelector;