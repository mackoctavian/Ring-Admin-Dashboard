
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
  value?: Category;
  type?: CategoryType;
  onChange: (value: Category) => void;
}

const CategorySelector: React.FC<Props> = ({ value, type, onChange }) => {
  const [categories, setCategory] = useState<Category[]>([]);

  useEffect(() => {
    async function fetchCategory() {
      try {
        const categoriesData = await getItems( '', 'IS_CHILD', type, true, null, 1 );
        setCategory(categoriesData);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    }
    fetchCategory();
  }, []);

  const handleSelectChange = (value: string) => {
    const selectedCategory = categories.find(cat => cat.$id === value);
    if (selectedCategory) {
      onChange(selectedCategory);
    }
  };

  return (
    <Select value={value ? value.$id : 'Select category'} onValueChange={handleSelectChange}>
      <SelectTrigger>
        <SelectValue>
          {value ? value.name : 'Select category'}
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