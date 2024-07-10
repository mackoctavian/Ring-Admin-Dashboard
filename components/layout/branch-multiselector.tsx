import React, { useEffect, useState } from 'react';
import MultipleSelector, { Option } from '@/components/ui/multiple-selector';
import { list } from '@/lib/actions/branch.actions';
import { Branch } from '@/types';
import { ReloadIcon } from "@radix-ui/react-icons"

interface Props {
  value?: Branch[] | [];
  onChange: (value: Branch[] | []) => void;
}

const BranchSelector: React.FC<Props> = ({ value = [], onChange }) => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [options, setOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchBranches() {
      try {
        const branchesData = await list();
        setBranches(branchesData);
        const formattedOptions = branchesData.map(branch => ({ label: branch.name, value: branch.$id }));
        setOptions(formattedOptions);
      } catch (error : any) {
        console.error('Error fetching branches:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchBranches();
  }, []);

  const handleSelectChange = (selectedOptions: Option[]) => {
    const selectedBranches = selectedOptions
      .map(option => branches.find(branch => branch.$id === option.value))
      .filter((branch): branch is Branch => branch !== undefined);
    onChange(selectedBranches.length > 0 ? selectedBranches : []);
  };

  const handleSearch = async (searchValue: string): Promise<Option[]> => {
    if (searchValue.trim() === '') {
      return options;
    }

    const filteredBranches = branches.filter(branch =>
      branch.name.toLowerCase().includes(searchValue.toLowerCase())
    );
    const formattedOptions = filteredBranches.map(branch => ({
      label: branch.name,
      value: branch.$id!,
    }));

    // If all branches are selected, return empty options to prevent "No results found" message
    if (value && value.length === branches.length) {
      return [];
    }

    return formattedOptions;
  };

  return (
    <MultipleSelector
      onSearch={handleSearch}
      defaultOptions={options}
      value={value ? value.map(branch => ({ label: branch.name, value: branch.$id })) : []}
      onChange={handleSelectChange}
      triggerSearchOnFocus
      placeholder="Select branches..."
      loadingIndicator={
        <><ReloadIcon className="mr-2 h-4 w-4 animate-spin" /> &nbsp; Loading branches...</>
      }
      emptyIndicator={
        loading ? (
          <><ReloadIcon className="mr-2 h-4 w-4 animate-spin" /> &nbsp; Loading branches...</>
        ) : (
          value && value.length > 0 && value.length === branches.length ? [] : (
            <p className="py-2 text-center text-sm leading-10 text-muted-foreground">No results found.</p>
          )
        )
      }
    />
  );
};

export default BranchSelector;
