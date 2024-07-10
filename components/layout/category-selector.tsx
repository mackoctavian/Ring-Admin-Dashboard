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
  value?: Category | null;
  onChange: (value: Category | null) => void;
  type: string;
}

const CategorySelector: React.FC<Props> = ({ value, onChange, type }) => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const categoriesData = await list();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    }
    fetchCategories();
  }, []);

  const handleSelectChange = (value: string) => {
    const selectedCategory = categories.find(category => category.$id === value);
    onChange(selectedCategory || null);
  };

  return (
    <Select value={value ? value.$id : 'null'} onValueChange={handleSelectChange}>
      <SelectTrigger>
        <SelectValue>{value ? value.name : 'Select category'}</SelectValue>
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