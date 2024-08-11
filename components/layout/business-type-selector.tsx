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
  value?: string | null;
  onChange: (value: string) => void;
}

const BusinessTypeSelector: React.FC<Props> = ({ value, onChange }) => {
  const [businessTypes, setBusinessTypes] = useState<BusinessType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBusinessTypes() {
      try {
        setIsLoading(true);
        const businessTypesData = await getBusinessTypes();
        setBusinessTypes(businessTypesData || []); // Ensure it's always an array
        setError(null);
      } catch (error: any) {
        setError("Failed to load business types");
        console.error("Error fetching business types:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchBusinessTypes();
  }, []);

  const handleSelectChange = (selectedId: string) => {
    onChange(selectedId === 'default' ? '' : selectedId);
  };

  if (isLoading) {
    return <div className={`text-sm text-muted-foreground`}>Loading business types...</div>;
  }

  if (error) {
    return <div className={`text-sm text-destructive-foreground`}>Error: could not load business types</div>;
  }

  return (
      <Select
          value={value || 'default'}
          onValueChange={handleSelectChange}>
        <SelectTrigger>
          <SelectValue>
            {value ? businessTypes.find(businessType => businessType.name === value)?.name || 'Select business type' : 'Select business type'}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="default" disabled>
            Select business type
          </SelectItem>
          {businessTypes.map((businessType) => (
              <SelectItem key={businessType.$id} value={businessType.name}>
                {businessType.name}
              </SelectItem>
          ))}
        </SelectContent>
      </Select>
  );
};

export default BusinessTypeSelector;