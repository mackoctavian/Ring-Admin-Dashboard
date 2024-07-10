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
  value?: Branch | null;
  onChange: (value: Branch | null) => void;
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
    const selectedBranch = branches.find(br => br.$id === value);
    onChange(selectedBranch || null);
  };

  return (
    <Select value={value ? value.$id : 'null'} onValueChange={handleSelectChange}>
      <SelectTrigger>
        <SelectValue>{value ? value.name : 'Select Branch'}</SelectValue>
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