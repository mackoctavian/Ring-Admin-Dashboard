
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
  onChange: (value: Category) => void;
  type?: CategoryType;
}

const CategorySelector: React.FC<Props> = ({ value, onChange, type }) => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const categoriesData = await getItems( '', 'NOT_EMPTY', type, null, null, 0);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    }
    fetchCategories();
  }, [type]);

  const handleSelectChange = (value: string) => {
    const selectedCategory = categories.find(cat => cat.$id === value);
    if (selectedCategory) {
      onChange(selectedCategory);
    }
  };

  return (
    <Select value={value ? value.$id : 'Select Category'} onValueChange={handleSelectChange}>
      <SelectTrigger>
        <SelectValue>
          {value ? value.name : 'Select Category'}
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