import React, { useEffect, useState } from 'react';
import MultipleSelector, { Option } from '@/components/ui/multiple-selector';
import { list } from '@/lib/actions/department.actions';
import { Department } from '@/types';
import { ReloadIcon } from "@radix-ui/react-icons"

interface Props {
  value?: Department[] | [];
  onChange: (value: Department[] | []) => void;
}

const DepartmentSelector: React.FC<Props> = ({ value = [], onChange }) => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [options, setOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchDepartments() {
      try {
        const departmentsData = await list();
        setDepartments(departmentsData);
        const formattedOptions = departmentsData.map(department => ({ label: department.name, value: department.$id }));
        setOptions(formattedOptions);
      } catch (error: any) {
        console.error('Error fetching departments:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchDepartments();
  }, []);

  const handleSelectChange = (selectedOptions: Option[]) => {
    const selectedDepartments = selectedOptions
      .map(option => departments.find(department => department.$id === option.value))
      .filter((department): department is Department => department !== undefined);
    console.log('Selected departments:', selectedDepartments);
    onChange(selectedDepartments.length > 0 ? selectedDepartments : []);
  };

  const handleSearch = async (searchValue: string): Promise<Option[]> => {
    if (searchValue.trim() === '') {
      return options;
    }

    const filteredDepartments = departments.filter(department =>
        department.name.toLowerCase().includes(searchValue.toLowerCase())
    );
    const formattedOptions = filteredDepartments.map(department => ({
      label: department.name,
      value: department.$id!,
    }));

    // If all department are selected, return empty options to prevent "No results found" message
    if (value && value.length === departments.length) {
      return [];
    }

    return formattedOptions;
  };

  return (
    <MultipleSelector
      onSearch={handleSearch}
      defaultOptions={options}
      value={value ? value.map(department => ({ label: department.name, value: department.$id })) : []}
      onChange={handleSelectChange}
      triggerSearchOnFocus={true}
      placeholder="Select departments..."
      loadingIndicator={
        <><ReloadIcon className="mr-2 h-4 w-4 animate-spin" /> &nbsp; Loading departments...</>
      }
      emptyIndicator={
        loading ? (
          <><ReloadIcon className="mr-2 h-4 w-4 animate-spin" /> &nbsp; Loading departments...</>
        ) : (
          value && value.length > 0 && value.length === departments.length ? [] : (
            <p className="py-2 text-center text-sm leading-10 text-muted-foreground">No results found.</p>
          )
        )
      }
    />
  );
};

export default DepartmentSelector;
