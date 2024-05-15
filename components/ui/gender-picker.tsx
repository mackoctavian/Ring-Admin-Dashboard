"use client";
import React, { useEffect, useState } from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    SelectGroup,
    SelectLabel,
} from "@/components/ui/select";
import { Gender } from '@/types';

interface Props {
    value?: string;
    onChange: (value: string) => void;
}

const GenderSelect: React.FC<Props> = ({ value, onChange }) => {
    const [genders, setGender] = useState<Gender[]>([]);

    return (
        <Select value={value}>
            <SelectTrigger>
                <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                 <SelectItem key="male" value="MALE">Male</SelectItem>
                 <SelectItem key="female" value="FEMALE">Female</SelectItem>
                 <SelectItem key="undisclosed" value="UNDISCLOSED">I don't want to disclose</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    );
};

export default GenderSelect;