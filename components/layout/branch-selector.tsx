import React, { useEffect, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { list } from "@/lib/actions/branch.actions"
import { Branch } from "@/types";

interface Props {
  value?: Branch; // Update the type to allow null
  onChange: (value: Branch) => void; // Update the type to allow null
}

const BranchSelector: React.FC<Props> = ({ value, onChange }) => {
  const [branches, setBranches] = useState<Branch[]>([]);

  useEffect(() => {
    async function fetchBranches() {
      try {
        const branchesData = await list();
        setBranches(branchesData);
      } catch (error) {
        console.error('Error fetching branches:', error);
      }
    }
    fetchBranches();
  }, []);

  const handleSelectChange = (value: string) => {
    if (value === 'null') { // Check if the value is 'null'
      onChange(null);
    } else {
      const selectedBranch = branches.find(br => br.$id === value);
      if (selectedBranch) {
        onChange(selectedBranch);
      }
    }
  };

  return (
    <Select value={value ? value.$id : 'null'} onValueChange={handleSelectChange}>
      <SelectTrigger>
        <SelectValue>
          {value ? value.name : 'Select Branch'}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {branches.map((branch) => (
          <SelectItem key={branch.$id} value={branch.$id}>
            {branch.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default BranchSelector;
