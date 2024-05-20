
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

export default function DepartmentSelector({ value, onChange }: Props) {
  const [departments, setDepartments] = useState<Department[]>([]);

  useEffect(() => {
    async function fetchDepartments() {
      const departmentsData = await list();
      setDepartments(departmentsData);
    }
    fetchDepartments();
  }, []);

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder="Select department" />
      </SelectTrigger>
      <SelectContent>
        {departments.map((department) => (
          <SelectItem key={department.$id} value={department}>
            {department.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}