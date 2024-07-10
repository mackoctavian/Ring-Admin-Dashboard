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
                <SelectItem value="06:30">6:30 AM</SelectItem>
                <SelectItem value="07:00">7:00 AM</SelectItem>
                <SelectItem value="07:30">7:30 AM</SelectItem>
                <SelectItem value="08:00">8:00 AM</SelectItem>
                <SelectItem value="08:30">8:30 AM</SelectItem>
                <SelectItem value="09:00">9:00 AM</SelectItem>
                <SelectItem value="09:30">9:30 AM</SelectItem>
                <SelectItem value="10:00">10:00 AM</SelectItem>
                <SelectItem value="10:30">10:30 AM</SelectItem>
                <SelectItem value="11:00">11:00 AM</SelectItem>
                <SelectItem value="11:30">11:30 AM</SelectItem>
                <SelectItem value="12:00">12:00 PM (Noon)</SelectItem>
                <SelectItem value="12:30">12:30 PM</SelectItem>
                <SelectItem value="13:00">1:00 PM</SelectItem>
                <SelectItem value="13:30">1:30 PM</SelectItem>
                <SelectItem value="14:00">2:00 PM</SelectItem>
                <SelectItem value="14:30">2:30 PM</SelectItem>
                <SelectItem value="15:00">3:00 PM</SelectItem>
                <SelectItem value="15:30">3:30 PM</SelectItem>
                <SelectItem value="16:00">4:00 PM</SelectItem>
                <SelectItem value="16:30">4:30 PM</SelectItem>
                <SelectItem value="17:00">5:00 PM</SelectItem>
                <SelectItem value="17:30">5:30 PM</SelectItem>
                <SelectItem value="18:00">6:00 PM</SelectItem>
                <SelectItem value="18:30">6:30 PM</SelectItem>
                <SelectItem value="19:00">7:00 PM</SelectItem>
                <SelectItem value="19:30">7:30 PM</SelectItem>
                <SelectItem value="20:00">8:00 PM</SelectItem>
                <SelectItem value="20:30">8:30 PM</SelectItem>
                <SelectItem value="21:00">9:00 PM</SelectItem>
                <SelectItem value="21:30">9:30 PM</SelectItem>
                <SelectItem value="22:00">10:00 PM</SelectItem>
                <SelectItem value="22:30">10:30 PM</SelectItem>
                <SelectItem value="23:00">11:00 PM</SelectItem>
                <SelectItem value="23:30">11:30 PM</SelectItem>
            </SelectContent>
        </Select>
    ); 
}