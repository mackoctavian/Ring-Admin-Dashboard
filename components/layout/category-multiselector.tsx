'use client'

import React, { useEffect, useState } from 'react';
import MultipleSelector, { Option } from '@/components/ui/multiple-selector';
import { list } from '@/lib/actions/category.actions';
import {Category} from '@/types';
import { ReloadIcon } from "@radix-ui/react-icons"

interface Props {
  value?: Category[];
  onChange: (value: string[]) => void;
}

const CategorySelector: React.FC<Props> = ({ value = [], onChange }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [options, setOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const categoriesData = await list();
        setCategories(categoriesData);
        const formattedOptions = categoriesData.map((category: Category) => ({ label: category.name, value: category.$id }));
        setOptions(formattedOptions);
      } catch (error : any) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  const handleSelectChange = (selectedOptions: Option[]) => {
    const selectedCategoryIds = selectedOptions.map(option => option.value);
    onChange(selectedCategoryIds);
  };

  const handleSearch = async (searchValue: string): Promise<Option[]> => {
    if (searchValue.trim() === '') {
      return options;
    }

    const filteredOptions = options.filter(option =>
        option.label.toLowerCase().includes(searchValue.toLowerCase())
    );

    // If all categories are selected, return empty options to prevent "No results found" message
    if (value && value.length === categories.length) {
      return [];
    }

    return filteredOptions;
  };

  const selectedOptions = options.filter(option =>
      value.some(category => category.$id === option.value)
  );

  return (
      <MultipleSelector
          onSearch={handleSearch}
          defaultOptions={options}
          value={selectedOptions}
          onChange={handleSelectChange}
          triggerSearchOnFocus
          placeholder="Select categories..."
          loadingIndicator={
            <><ReloadIcon className="mr-2 h-4 w-4 animate-spin" /> &nbsp; Loading categories...</>
          }
          emptyIndicator={
            loading ? (
                <><ReloadIcon className="mr-2 h-4 w-4 animate-spin" /> &nbsp; Loading categories...</>
            ) : (
                value && value.length > 0 && value.length === categories.length ? [] : (
                    <p className="py-2 text-center text-sm leading-10 text-muted-foreground">No results found.</p>
                )
            )
          }
      />
  );
};

export default CategorySelector;