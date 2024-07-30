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

interface Props {
  value?: string;
  onChange: (value: string) => void;
}

const DepartmentSelector: React.FC<Props> = ({ value, onChange }) => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchDepartments() {
      try {
        const departmentsData = await list();
        setDepartments(departmentsData);
      } catch (error) {
        console.error('Error fetching departments:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchDepartments();
  }, []);

  const handleSelectChange = (selectedId: string) => {
    onChange(selectedId);
  };

  const selectedDepartment = departments.find(dept => dept.$id === value);

  return (
      <Select value={value || 'default'} onValueChange={handleSelectChange} disabled={loading}>
        <SelectTrigger>
          <SelectValue>
            {loading ? 'Loading...' : (selectedDepartment ? selectedDepartment.name : 'Select department')}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="default" disabled>
            Select department
          </SelectItem>
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