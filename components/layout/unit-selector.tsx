import React, { useEffect, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { list } from "@/lib/actions/product-unit.actions";
import { ProductUnit } from "@/types";

interface Props {
  value?: string; // Changed to string to represent unit's $id
  onChange: (value: string) => void; // Changed to string
}

const UnitSelector: React.FC<Props> = ({ value, onChange }) => {
  const [units, setUnits] = useState<ProductUnit[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // State to track loading

  useEffect(() => {
    async function fetchUnits() {
      try {
        const unitsData = await list();
        setUnits(unitsData);
      } catch (error) {
        console.error('Error fetching units:', error);
      } finally {
        setLoading(false); // Set loading to false after data is fetched
      }
    }
    fetchUnits();
  }, []);

  const handleSelectChange = (value: string) => {
    onChange(value);
  };

  const selectedUnit = units.find(unit => unit.$id === value);

  // Group units by type
  const groupedUnits = units.reduce((groups, unit) => {
    if (!groups[unit.type]) {
      groups[unit.type] = [];
    }
    groups[unit.type].push(unit);
    return groups;
  }, {} as { [key: string]: ProductUnit[] });

  // Function to convert type to lowercase with the first letter capitalized
  const formatType = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
  };

  return (
    <Select value={value || 'default'} onValueChange={handleSelectChange} disabled={loading}>
      <SelectTrigger>
        <SelectValue>
          {loading ? 'Loading...' : (selectedUnit ? `${selectedUnit.name} (${selectedUnit.abbreviation})` : 'Select Unit')}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="default" disabled>
          Select Unit
        </SelectItem> {/* Default option */}
        {Object.keys(groupedUnits).map(type => (
          <SelectGroup key={type}>
            <SelectLabel>{formatType(type)}</SelectLabel>
            {groupedUnits[type].map(unit => (
              <SelectItem key={unit.$id} value={unit.$id}>
                {unit.name} ({unit.abbreviation})
              </SelectItem>
            ))}
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  );
};

export default UnitSelector;
