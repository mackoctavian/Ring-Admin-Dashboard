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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBranches() {
      try {
        setIsLoading(true);
        const branchesData = await list();
        setBranches(branchesData || []); // Ensure it's always an array
        setError(null);
      } catch (error: any) {
        setError("Failed to load branches");
        console.error("Error fetching branches:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchBranches();
  }, []);

  const handleSelectChange = (selectedId: string) => {
    onChange(selectedId === 'default' ? '' : selectedId);
  };

  if (isLoading) {
    return <div className={`text-sm text-muted-foreground`}>Loading branches...</div>;
  }

  if (error) {
    return <div className={`text-sm text-destructive-foreground`}>Error: could not load branches</div>;
  }


  return (
      <Select
          value={value || 'default'}
          onValueChange={handleSelectChange}>
        <SelectTrigger>
          <SelectValue>
            {value ? branches.find(branch => branch.$id === value)?.name || 'Select branch' : 'Select branch'}
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