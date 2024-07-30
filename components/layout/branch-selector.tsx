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
  value?: string;
  onChange: (value: string) => void;
}

const BranchSelector: React.FC<Props> = ({ value, onChange }) => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchBranches() {
      try {
        const branchesData = await list();
        setBranches(branchesData);
      } catch (error) {
        console.error('Error fetching branches:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchBranches();
  }, []);

  const handleSelectChange = (selectedId: string) => {
    onChange(selectedId);
  };

  const selectedBranch = branches.find(br => br.$id === value);

  return (
      <Select value={value || 'default'} onValueChange={handleSelectChange} disabled={loading}>
        <SelectTrigger>
          <SelectValue>
            {loading ? 'Loading...' : (selectedBranch ? selectedBranch.name : 'Select branch')}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="default" disabled>
            Select branch
          </SelectItem>
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