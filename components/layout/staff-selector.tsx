
import React, { useEffect, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { list } from "@/lib/actions/staff.actions"
import { Staff } from "@/types";

interface Props {
  value?: Staff;
  onChange: (value: Staff) => void;
}

const StaffSelector: React.FC<Props> = ({ value, onChange }) => {
  const [staffs, setStaff] = useState<Staff[]>([]);

  useEffect(() => {
    async function fetchStaff() {
      try {
        const staffData = await list();
        setStaff(staffData);
      } catch (error) {
        console.error('Error fetching staff:', error);
      }
    }
    fetchStaff();
  }, []);

  const handleSelectChange = (value: string) => {
    const selectedStaff = staffs.find(stf => stf.$id === value);
    if (selectedStaff) {
      onChange(selectedStaff);
    }
  };

  return (
    <Select value={value ? value.$id : 'Select staff member'} onValueChange={handleSelectChange}>
      <SelectTrigger>
        <SelectValue>
          {value ? value.name : 'Select staff member'}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {staffs.map((staff) => (
          <SelectItem key={staff.$id} value={staff.$id}>
            {staff.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default StaffSelector;