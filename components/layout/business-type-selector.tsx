import React, { useEffect, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getBusinessTypes } from "@/lib/actions/business.actions"
import { BusinessType } from "@/types";

interface Props {
  value?: BusinessType;
  onChange: (value: BusinessType) => void;
}

const BusinessTypeSelector: React.FC<Props> = ({ value, onChange }) => {
  const [types, setTypes] = useState<BusinessType[]>([]);

  useEffect(() => {
    async function fetchTypes() {
      try {
        const data = await getBusinessTypes();
        setTypes(data);
      } catch (error) {
        console.error('Error fetching business types:', error);
      }
    }
    fetchTypes();
  }, []);

  const handleSelectChange = (value: string) => {
    const selectedType = types.find(type => type.$id === value);
    if (selectedType) {
      onChange(selectedType);
    }
  };

  return (
    <Select value={value ? value.$id : ''} onValueChange={handleSelectChange}>
      <SelectTrigger>
        <SelectValue>
          {value ? value.name : 'Select business type'}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {types.map((item) => (
          <SelectItem key={item.$id} value={item.$id}>
            {item.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default BusinessTypeSelector;