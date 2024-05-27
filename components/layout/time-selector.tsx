"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  value?: string | undefined;
  onChange: (value: string) => void;
}

export default function TimeSelector({ value, onChange }: Props) {
    return (
        <Select value={value} onValueChange={onChange}>
            <SelectTrigger>
                <SelectValue placeholder="Select time" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="00:00">Midnight</SelectItem>
                <SelectItem value="00:30">12:30 AM</SelectItem>
                <SelectItem value="01:00">1:00 AM</SelectItem>
                <SelectItem value="01:30">1:30 AM</SelectItem>
                <SelectItem value="02:00">2:00 AM</SelectItem>
                <SelectItem value="02:30">2:30 AM</SelectItem>
                <SelectItem value="03:00">3:00 AM</SelectItem>
                <SelectItem value="03:30">3:30 AM</SelectItem>
                <SelectItem value="04:00">4:00 AM</SelectItem>
                <SelectItem value="04:30">4:30 AM</SelectItem>
                <SelectItem value="05:00">5:00 AM</SelectItem>
                <SelectItem value="05:30">5:30 AM</SelectItem>
                <SelectItem value="06:00">6:00 AM</SelectItem>
            </SelectContent>
        </Select>
    ); 
}