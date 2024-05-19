
import React, { useEffect, useState } from 'react';
import { SelectContent, SelectItem } from "@/components/ui/select";
import { getItems } from "@/lib/actions/category.actions"
import { Category, CategoryType } from "@/types";


interface ProductCategorySelectorProps {
  parent?: string;
  type?: CategoryType;
}

function ProductCategorySelector({ parent, type }: ProductCategorySelectorProps) {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    async function fetchCategories() {
      const categoriesData = await getItems('', parent, type);
      setCategories(categoriesData);
    };
    fetchCategories()
  }, [type, parent]);

  return (
    <SelectContent>
      {categories.map((category) => (
        <SelectItem key={category.$id} value={category.$id}>
          {category.name}
        </SelectItem>
      ))}
    </SelectContent>
  );
}

export default ProductCategorySelector;