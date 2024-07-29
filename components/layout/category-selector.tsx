import React, { useEffect, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { list } from "@/lib/actions/category.actions"
import { Category } from "@/types";

interface Props {
  value?: string | null;
  onChange: (value: string | null) => void;
}

const CategorySelector: React.FC<Props> = ({ value, onChange }) => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const categoriesData = await list();
        setCategories(categoriesData);
      } catch (error: any) {
        // Error handling can be added here if needed
      }
    }
    fetchCategories();
  }, []);

  const handleSelectChange = (value: string) => {
    onChange(value === 'null' ? null : value);
  };

  return (
      <Select value={value || 'null'} onValueChange={handleSelectChange}>
        <SelectTrigger>
          <SelectValue>
            {value ? categories.find(category => category.$id === value)?.name || 'Select category' : 'Select category'}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {categories.map((category) => (
              <SelectItem key={category.$id} value={category.$id}>
                {category.name}
              </SelectItem>
          ))}
        </SelectContent>
      </Select>
  );
};

export default CategorySelector;