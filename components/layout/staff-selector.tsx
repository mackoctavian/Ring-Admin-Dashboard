import React, { useEffect, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { list } from "@/lib/actions/staff.actions"
import { Staff } from "@/types";

interface Props {
  value?: string;
  onChange: (value: string) => void;
}

const StaffSelector: React.FC<Props> = ({ value, onChange }) => {
  const [staffs, setStaff] = useState<Staff[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStaff() {
      try {
        setIsLoading(true);
        const staffData = await list();
        setStaff(staffData || []); // Ensure it's always an array
        setError(null);
      } catch (error: any) {
        setError("Failed to load staff");
        console.error("Error fetching staff:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchStaff();
  }, []);

  const handleSelectChange = (selectedId: string) => {
    onChange(selectedId === 'default' ? '' : selectedId);
  };

  const selectedStaff = staffs.find(stf => stf.$id === value);

  // Group staff by branch
  const groupedStaff = staffs.reduce((groups, staff) => {
    const branchName = staff.branch && staff.branch[0] ? staff.branch[0].name : 'Unassigned';
    if (!groups[branchName]) {
      groups[branchName] = [];
    }
    groups[branchName].push(staff);
    return groups;
  }, {} as { [key: string]: Staff[] });

  if (isLoading) {
    return <div className={`text-sm text-muted-foreground`}>Loading staff...</div>;
  }

  if (error) {
    return <div className={`text-sm text-destructive-foreground`}>Error: could not load staff</div>;
  }

  return (
      <Select value={value || 'default'} onValueChange={handleSelectChange}>
        <SelectTrigger>
          <SelectValue>
            {value ? selectedStaff?.firstName + " " + selectedStaff?.lastName || 'Select staff member' : 'Select staff member'}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="default" disabled>
            Select staff member
          </SelectItem>
          {Object.entries(groupedStaff).map(([branchName, branchStaff]) => (
              <SelectGroup key={branchName}>
                <SelectLabel>{branchName}</SelectLabel>
                {branchStaff.map((staff) => (
                    <SelectItem key={staff.$id} value={staff.$id}>
                      {staff.firstName + " " + staff.lastName || 'Un-named staff'}
                    </SelectItem>
                ))}
              </SelectGroup>
          ))}
        </SelectContent>
      </Select>
  );
};

export default StaffSelector;