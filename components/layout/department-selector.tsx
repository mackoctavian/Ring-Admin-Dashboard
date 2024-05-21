
import React, { useEffect, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { list } from "@/lib/actions/department.actions"
import { Department } from "@/types";
import { parseStringify } from "@/lib/utils";

interface Props {
  value?: Department;
  onChange: (value: Department) => void;
}

const DepartmentSelector: React.FC<Props> = ({ value, onChange }) => {
  const [departments, setDepartments] = useState<Department[]>([]);

  useEffect(() => {
    async function fetchDepartments() {
      try {
        const departmentsData = await list();
        setDepartments(departmentsData);
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    }
    fetchDepartments();
  }, []);

  const handleSelectChange = (value: string) => {
    const selectedDepartment = departments.find(dept => dept.$id === value);
    if (selectedDepartment) {
      onChange(selectedDepartment);
    }
  };

  return (
    <Select value={value ? value.$id : ''} onValueChange={handleSelectChange}>
      <SelectTrigger>
        <SelectValue>
          {value ? value.name : 'Select department'}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {departments.map((department) => (
          <SelectItem key={department.$id} value={department.$id}>
            {department.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default DepartmentSelector;