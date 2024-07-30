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
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchStaff() {
      try {
        const staffData = await list();
        setStaff(staffData);
      } catch (error) {
        console.error('Error fetching staff:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchStaff();
  }, []);

  const handleSelectChange = (selectedId: string) => {
    onChange(selectedId);
  };

  const selectedStaff = staffs.find(stf => stf.$id === value);

  // Group staff by branch
  const groupedStaff = staffs.reduce((groups, staff) => {
    const branchName = staff.branch![0].name;
    if (!groups[branchName]) {
      groups[branchName] = [];
    }
    groups[branchName].push(staff);
    return groups;
  }, {} as { [key: string]: Staff[] });

  return (
      <Select value={value || 'default'} onValueChange={handleSelectChange} disabled={loading}>
        <SelectTrigger>
          <SelectValue>
            {loading ? 'Loading...' : (selectedStaff ? selectedStaff.name : 'Select staff member')}
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
                      {staff.name}
                    </SelectItem>
                ))}
              </SelectGroup>
          ))}
        </SelectContent>
      </Select>
  );
};

export default StaffSelector;