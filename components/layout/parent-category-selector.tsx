
import React, { useEffect, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getItems } from "@/lib/actions/category.actions"
import { Category } from "@/types";
import { CategoryType } from '@/types/data-schemas';

interface Props {
  value?: string;
  type?: CategoryType;
  onChange: (categoryId: string) => void;
}

const ParentCategorySelector: React.FC<Props> = ({ value, type, onChange }) => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const categoriesData = await getItems('', '', type, null, null, 0);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    }
    fetchCategories();
  }, [type]);

  const handleChange = (value: string) => {
    onChange(value);
  };

  return (
    <Select value={value || ''} onValueChange={handleChange}>
      <SelectTrigger>
        <SelectValue placeholder="Select Category">
          {value ? categories.find(category => category.$id === value)?.name : 'Select Category'}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {categories.map(category => (
          <SelectItem key={category.$id} value={category.$id}>
            {category.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default ParentCategorySelector;