import React, { useEffect, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getBusinessTypes } from "@/lib/actions/business.actions";
import { BusinessType } from "@/types";

interface Props {
  value?: BusinessType | null;
  onChange: (value: BusinessType | null) => void;
}

const BusinessTypeSelector: React.FC<Props> = ({ value, onChange }) => {
  const [businessTypes, setBusinessTypes] = useState<BusinessType[]>([]);

  useEffect(() => {
    async function fetchBusinessTypes() {
      try {
        const businessTypes = await getBusinessTypes();
        setBusinessTypes(businessTypes);
      } catch (error) {
        console.error('Error fetching business types:', error);
      }
    }
    fetchBusinessTypes();
  }, []);

  const handleSelectChange = (id: string) => {
    const selectedBusinessType = businessTypes.find(businessType => businessType.$id === id);
    onChange(selectedBusinessType || null);
  };

  return (
      <Select value={value ? value.$id : ''} onValueChange={handleSelectChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select business type">
            {value ? value.name : 'Select business type'}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {businessTypes.map((businessType) => (
              <SelectItem key={businessType.$id} value={businessType.$id}>
                {businessType.name}
              </SelectItem>
          ))}
        </SelectContent>
      </Select>
  );
};

export default BusinessTypeSelector;
