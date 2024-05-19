
import React, { useEffect, useState } from 'react';
import { SelectContent, SelectItem } from "@/components/ui/select";
import { list } from "@/lib/actions/department.actions"
import { Department } from "@/types";
import { parseStringify } from "@/lib/utils";


function DepartmentSelector() {
  const [departments, setDepartments] = useState<Department[]>([]);

  useEffect(() => {
    async function fetchDepartments() {
      const departmentsData = await list();
      setDepartments(departmentsData);
    }
    fetchDepartments();
  }, []);

  return (
    <SelectContent>
      {departments.map((department) => (
        <SelectItem key={department.$id} value={parseStringify(department)}>
          {department.name}
        </SelectItem>
      ))}
    </SelectContent>
  );
}

export default DepartmentSelector;