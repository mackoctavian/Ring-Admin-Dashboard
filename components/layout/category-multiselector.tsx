import React, { useEffect, useState } from 'react';
import MultipleSelector, { Option } from '@/components/ui/multiple-selector';
import { list } from '@/lib/actions/category.actions';
import { Category } from '@/types';
import { ReloadIcon } from "@radix-ui/react-icons"

interface Props {
  value?: Category[] | [];
  onChange: (value: Category[] | []) => void;
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
        const formattedOptions = categoriesData.map(category => ({ label: category.name, value: category.$id }));
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
    const selectedCategories = selectedOptions
      .map(option => categories.find(category => category.$id === option.value))
      .filter((category): category is Category => category !== undefined);
    onChange(selectedCategories.length > 0 ? selectedCategories : []);
  };

  const handleSearch = async (searchValue: string): Promise<Option[]> => {
    if (searchValue.trim() === '') {
      return options;
    }

    const filteredCategories = categories.filter(category =>
      category.name.toLowerCase().includes(searchValue.toLowerCase())
    );
    const formattedOptions = filteredCategories.map(category => ({
      label: category.name,
      value: category.$id!,
    }));

    // If all categories are selected, return empty options to prevent "No results found" message
    if (value && value.length === categories.length) {
      return [];
    }

    return formattedOptions;
  };

  return (
    <MultipleSelector
      onSearch={handleSearch}
      defaultOptions={options}
      value={value ? value.map(category => ({ label: category.name, value: category.$id })) : []}
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
