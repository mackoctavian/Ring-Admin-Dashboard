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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCategories() {
      try {
        setIsLoading(true);
        const categoriesData = await list();
        setCategories(categoriesData || []); // Ensure it's always an array
        setError(null);
      } catch (error: any) {
        setError("Failed to load categories");
      } finally {
        setIsLoading(false);
      }
    }
    fetchCategories();
  }, []);

  const handleSelectChange = (value: string) => {
    onChange(value === 'null' ? null : value);
  };

  if (isLoading) {
    return <div className={`text-sm text-muted-foreground`}>Loading categories...</div>;
  }

  if (error) {
    return <div className={`text-sm text-destructive-foreground`}>Error: could not load categories</div>;
  }

  return (
      <Select value={value || 'null'} onValueChange={handleSelectChange}>
        <SelectTrigger>
          <SelectValue>
            {value ? categories.find(category => category.$id === value)?.name || 'Select category' : 'Select category'}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="null">Select category</SelectItem>
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