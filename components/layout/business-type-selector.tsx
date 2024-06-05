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
    const [type, setType] = useState<BusinessType[]>([]);
  
    useEffect(() => {
      async function fetchType() {
        try {
          const data = await getBusinessTypes();
          setType(data);
        } catch (error) {
          console.error('Error fetching business types:', error);
        }
      }
      fetchType();
    }, []);
  
    const handleSelectChange = (value: string) => {
      const selectedType = type.find(inv => inv.$id === value);
      if (selectedType) {
        onChange(selectedType);
      }
    };
  
    return (
      <Select value={value ? value.$id : 'Select business type'} onValueChange={handleSelectChange}>
        <SelectTrigger>
          <SelectValue>
            {value ? value.name : 'Select business type'}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {type.map((item) => (
            <SelectItem key={item.$id} value={item.$id}>
              { item.name }
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  };
  
  export default BusinessTypeSelector;