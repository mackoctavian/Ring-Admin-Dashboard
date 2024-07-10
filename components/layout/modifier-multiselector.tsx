import React, { useEffect, useState } from 'react';
import MultipleSelector, { Option } from '@/components/ui/multiple-selector';
import { list } from '@/lib/actions/modifier.actions';
import { Modifier } from '@/types';
import { ReloadIcon } from "@radix-ui/react-icons"

interface Props {
  value?: Modifier[] | [];
  onChange: (value: Modifier[] | []) => void;
}

const ModifierSelector: React.FC<Props> = ({ value = [], onChange }) => {
  const [modifiers, setModifiers] = useState<Modifier[]>([]);
  const [options, setOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchBranches() {
      try {
        const modifiersData = await list();
        setModifiers(modifiersData);
        const formattedOptions = modifiersData.map(modifier => ({ label: modifier.name, value: modifier.$id }));
        setOptions(formattedOptions);
      } catch (error : any) {
        console.error('Error fetching modifiers:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchBranches();
  }, []);

  const handleSelectChange = (selectedOptions: Option[]) => {
    const selectedModifiers = selectedOptions
      .map(option => modifiers.find(modifier => modifier.$id === option.value))
      .filter((modifier): modifier is Modifier => modifier !== undefined);
    onChange(selectedModifiers.length > 0 ? selectedModifiers : []);
  };

  const handleSearch = async (searchValue: string): Promise<Option[]> => {
    if (searchValue.trim() === '') {
      return options;
    }

    const filteredModifiers = modifiers.filter(modifier =>
      modifier.name.toLowerCase().includes(searchValue.toLowerCase())
    );
    const formattedOptions = filteredModifiers.map(modifier => ({
      label: modifier.name,
      value: modifier.$id!,
    }));

    // If all modifiers are selected, return empty options to prevent "No results found" message
    if (value && value.length === modifiers.length) {
      return [];
    }

    return formattedOptions;
  };

  return (
    <MultipleSelector
      onSearch={handleSearch}
      defaultOptions={options}
      value={value ? value.map(modifier => ({ label: modifier.name, value: modifier.$id })) : []}
      onChange={handleSelectChange}
      triggerSearchOnFocus
      placeholder="Select modifiers..."
      loadingIndicator={
        <><ReloadIcon className="mr-2 h-4 w-4 animate-spin" /> &nbsp; Loading modifiers...</>
      }
      emptyIndicator={
        loading ? (
          <><ReloadIcon className="mr-2 h-4 w-4 animate-spin" /> &nbsp; Loading modifiers...</>
        ) : (
          value && value.length > 0 && value.length === modifiers.length ? [] : (
            <p className="py-2 text-center text-sm leading-10 text-muted-foreground">No results found.</p>
          )
        )
      }
    />
  );
};

export default ModifierSelector;
