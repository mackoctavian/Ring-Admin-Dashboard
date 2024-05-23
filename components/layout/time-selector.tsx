"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  value?: string;
  onChange: (value: string) => void;
}

export default function TimeSelector({ value, onChange }: Props) {
    return (
        <Select value={value} onValueChange={onChange}>
            <SelectTrigger>
                <SelectValue placeholder="Select time" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="0000">Midnight</SelectItem>
                <SelectItem value="00:30">12:30 AM</SelectItem>
                <SelectItem value="01:00">1:00 AM</SelectItem>
            </SelectContent>
        </Select>
    ); 
}